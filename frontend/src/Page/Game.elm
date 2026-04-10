module Page.Game exposing (Model, Msg(..), init, update, view, subscriptions)

import Api.Action exposing (PlayResult, SimulationResult, SwapResult)
import Api.Http exposing (authGet, authPostEmpty)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Http
import Json.Decode as Decode
import Json.Encode as Encode
import Port
import Set exposing (Set)
import Types.Game exposing (GameState, gameStateDecoder)
import Types.Player exposing (Player, displayName)
import Types.Color exposing (colorToString)
import Types.Shape exposing (shapeToString)
import Types.Tile exposing (BoardTile, Coordinate, RackTile, TileFace)
import View.Board exposing (Viewport, defaultViewport, viewBoard)
import View.Rack exposing (viewRack)
import View.Scoreboard exposing (viewScoreboard)


type alias Model =
    { gameId : Int
    , baseUrl : String
    , token : String
    , board : List BoardTile
    , rack : List RackTile
    , players : List Player
    , bagCount : Int
    , currentTurnPseudo : String
    , myPseudo : String
    , winner : Maybe String
    , loading : Bool
    , error : Maybe String

    -- Tile placement state
    , selectedRackIndex : Maybe Int
    , pendingPlacements : List BoardTile
    , simulationScore : Maybe Int
    , simulationCode : Maybe String

    -- Swap state
    , swapMode : Bool
    , swapSelected : List Int

    -- Last played tiles (for glow effect)
    , lastPlayedCoords : Set ( Int, Int )

    -- Viewport for pan/zoom
    , viewport : Viewport

    -- Pan drag state
    , isPanning : Bool
    , panStart : { x : Float, y : Float }

    -- 3D view
    , is3DView : Bool
    }


type Msg
    = GotGameState (Result Http.Error GameState)
    | GotSimulation (Result Http.Error SimulationResult)
    | GotPlayResult (Result Http.Error PlayResult)
    | GotSwapResult (Result Http.Error SwapResult)
    | GotSkipResult (Result Http.Error ())
      -- Rack interaction
    | SelectRackTile Int
      -- Board interaction
    | ClickBoardCell Coordinate
    | RemovePending Coordinate
      -- Actions
    | ValidatePlay
    | EnterSwapMode
    | ConfirmSwap
    | CancelSwap
    | SkipTurn
    | UndoAllPlacements
      -- SSE events
    | SseTilesPlayed { playerId : Int, points : Int, tiles : List BoardTile }
    | SseTilesSwapped { playerId : Int }
    | SseTurnChanged { playerId : Int, pseudo : String }
    | SseGameOver { winnerIds : List Int }
      -- Pan/Zoom
    | ZoomBoard Float
    | PanBoard Float Float
    | StartPan Float Float
    | MovePan Float Float
    | StopPan
      -- Navigation
    | GoToLobby
      -- Refresh
    | RefreshGame
      -- 3D
    | Toggle3DView
    | From3DBoardClick Coordinate
    | From3DRackClick Int
    | From3DPendingClick Coordinate


init : String -> String -> Int -> ( Model, Cmd Msg )
init baseUrl token gameId =
    ( { gameId = gameId
      , baseUrl = baseUrl
      , token = token
      , board = []
      , rack = []
      , players = []
      , bagCount = 0
      , currentTurnPseudo = ""
      , myPseudo = ""
      , winner = Nothing
      , loading = True
      , error = Nothing
      , selectedRackIndex = Nothing
      , pendingPlacements = []
      , simulationScore = Nothing
      , simulationCode = Nothing
      , swapMode = False
      , swapSelected = []
      , lastPlayedCoords = Set.empty
      , viewport = defaultViewport
      , isPanning = False
      , panStart = { x = 0, y = 0 }
      , is3DView = False
      }
    , fetchGame baseUrl token gameId
    )


fetchGame : String -> String -> Int -> Cmd Msg
fetchGame baseUrl token gameId =
    authGet baseUrl token ("/api/games/" ++ String.fromInt gameId) gameStateDecoder GotGameState


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotGameState (Ok state) ->
            let
                currentPlayer =
                    state.players
                        |> List.filter .isTurn
                        |> List.head

                myPlayer =
                    state.players |> List.head

                newModel =
                    { model
                        | board = state.board
                        , rack = myPlayer |> Maybe.map .rack |> Maybe.withDefault []
                        , players = state.players
                        , bagCount = state.bagCount
                        , currentTurnPseudo = currentPlayer |> Maybe.map .pseudo |> Maybe.withDefault ""
                        , loading = False
                        , error = Nothing
                    }
            in
            ( newModel, emitSceneState newModel )

        GotGameState (Err _) ->
            ( { model | error = Just "Failed to load game", loading = False }, Cmd.none )

        -- Rack tile selection
        SelectRackTile idx ->
            if model.swapMode then
                let
                    newSelected =
                        if List.member idx model.swapSelected then
                            List.filter (\i -> i /= idx) model.swapSelected

                        else
                            idx :: model.swapSelected
                in
                ( { model | swapSelected = newSelected }, Cmd.none )

            else
                let
                    newModel =
                        { model
                            | selectedRackIndex =
                                if model.selectedRackIndex == Just idx then
                                    Nothing

                                else
                                    Just idx
                        }
                in
                ( newModel, emitSceneState newModel )

        -- Click empty board cell to place selected rack tile
        ClickBoardCell coord ->
            case model.selectedRackIndex of
                Just idx ->
                    case listGet idx model.rack of
                        Just rackTile ->
                            let
                                placement =
                                    { face = rackTile.face
                                    , coordinate = coord
                                    }

                                newPending =
                                    model.pendingPlacements ++ [ placement ]

                                newRack =
                                    listRemoveAt idx model.rack

                                newModel =
                                    { model
                                        | pendingPlacements = newPending
                                        , rack = newRack
                                        , selectedRackIndex = Nothing
                                        , simulationScore = Nothing
                                        , simulationCode = Nothing
                                    }
                            in
                            ( newModel
                            , Cmd.batch
                                [ simulatePlay model newPending
                                , emitSceneState newModel
                                ]
                            )

                        Nothing ->
                            ( model, Cmd.none )

                Nothing ->
                    ( model, Cmd.none )

        -- Remove a pending tile back to rack
        RemovePending coord ->
            let
                ( removed, kept ) =
                    List.partition (\bt -> bt.coordinate == coord) model.pendingPlacements

                restoredRack =
                    model.rack
                        ++ List.indexedMap
                            (\i bt ->
                                { face = bt.face
                                , rackPosition = List.length model.rack + i
                                }
                            )
                            removed

                newModel =
                    { model
                        | pendingPlacements = kept
                        , rack = restoredRack
                        , simulationScore = Nothing
                        , simulationCode = Nothing
                    }
            in
            ( newModel
            , Cmd.batch
                [ if not (List.isEmpty kept) then
                    simulatePlay model kept

                  else
                    Cmd.none
                , emitSceneState newModel
                ]
            )

        -- Simulation result
        GotSimulation (Ok result) ->
            ( { model
                | simulationScore =
                    if result.code == "ok" then
                        Just result.points

                    else
                        Nothing
                , simulationCode =
                    if result.code /= "ok" then
                        Just result.code

                    else
                        Nothing
              }
            , Cmd.none
            )

        GotSimulation (Err _) ->
            ( { model | simulationCode = Just "Server error" }, Cmd.none )

        -- Submit play
        ValidatePlay ->
            if List.isEmpty model.pendingPlacements then
                ( model, Cmd.none )

            else
                let
                    placements =
                        List.map
                            (\bt -> { face = bt.face, coordinate = bt.coordinate })
                            model.pendingPlacements
                in
                ( model
                , Api.Action.playTiles model.baseUrl model.token model.gameId placements GotPlayResult
                )

        GotPlayResult (Ok result) ->
            if result.code == "ok" then
                let
                    newModel =
                        { model
                            | pendingPlacements = []
                            , rack = result.newRack
                            , selectedRackIndex = Nothing
                            , simulationScore = Nothing
                            , simulationCode = Nothing
                        }
                in
                ( newModel
                , Cmd.batch
                    [ fetchGame model.baseUrl model.token model.gameId
                    , emitSceneState newModel
                    ]
                )

            else
                ( { model | simulationCode = Just result.code }, Cmd.none )

        GotPlayResult (Err _) ->
            ( { model | error = Just "Play failed" }, Cmd.none )

        -- Swap mode
        EnterSwapMode ->
            ( { model | swapMode = True, swapSelected = [], selectedRackIndex = Nothing }, Cmd.none )

        CancelSwap ->
            ( { model | swapMode = False, swapSelected = [] }, Cmd.none )

        ConfirmSwap ->
            let
                faces =
                    model.swapSelected
                        |> List.filterMap (\idx -> listGet idx model.rack)
                        |> List.map .face
            in
            if List.isEmpty faces then
                ( model, Cmd.none )

            else
                ( model
                , Api.Action.swapTiles model.baseUrl model.token model.gameId faces GotSwapResult
                )

        GotSwapResult (Ok result) ->
            let
                newModel =
                    { model
                        | rack = result.newRack
                        , swapMode = False
                        , swapSelected = []
                    }
            in
            ( newModel
            , Cmd.batch
                [ fetchGame model.baseUrl model.token model.gameId
                , emitSceneState newModel
                ]
            )

        GotSwapResult (Err _) ->
            ( { model | error = Just "Swap failed" }, Cmd.none )

        -- Skip turn
        SkipTurn ->
            ( model
            , Api.Action.skipTurn model.baseUrl model.token model.gameId GotSkipResult
            )

        GotSkipResult (Ok _) ->
            ( model, fetchGame model.baseUrl model.token model.gameId )

        GotSkipResult (Err _) ->
            ( { model | error = Just "Skip failed" }, Cmd.none )

        -- Undo all pending placements
        UndoAllPlacements ->
            let
                restoredRack =
                    model.rack
                        ++ List.indexedMap
                            (\i bt ->
                                { face = bt.face
                                , rackPosition = List.length model.rack + i
                                }
                            )
                            model.pendingPlacements

                newModel =
                    { model
                        | pendingPlacements = []
                        , rack = restoredRack
                        , selectedRackIndex = Nothing
                        , simulationScore = Nothing
                        , simulationCode = Nothing
                    }
            in
            ( newModel, emitSceneState newModel )

        -- SSE: opponent played tiles
        SseTilesPlayed data ->
            let
                newBoard =
                    model.board ++ data.tiles

                lastCoords =
                    data.tiles
                        |> List.map (\t -> ( t.coordinate.x, t.coordinate.y ))
                        |> Set.fromList
            in
            ( { model
                | board = newBoard
                , lastPlayedCoords = lastCoords
              }
            , fetchGame model.baseUrl model.token model.gameId
            )

        -- SSE: opponent swapped tiles
        SseTilesSwapped _ ->
            ( model, fetchGame model.baseUrl model.token model.gameId )

        -- SSE: turn changed
        SseTurnChanged data ->
            ( { model | currentTurnPseudo = data.pseudo }, Cmd.none )

        -- SSE: game over
        SseGameOver data ->
            let
                winnerName =
                    model.players
                        |> List.filter (\p -> List.member p.id data.winnerIds)
                        |> List.head
                        |> Maybe.map (.pseudo >> displayName)
                        |> Maybe.withDefault "Unknown"
            in
            ( { model | winner = Just winnerName }, Cmd.none )

        -- Pan/Zoom
        ZoomBoard delta ->
            let
                vp =
                    model.viewport

                newScale =
                    clamp 0.3 3.0 (vp.scale + delta * 0.001)
            in
            ( { model | viewport = { vp | scale = newScale } }, Cmd.none )

        PanBoard dx dy ->
            let
                vp =
                    model.viewport
            in
            ( { model | viewport = { vp | offsetX = vp.offsetX + dx, offsetY = vp.offsetY + dy } }, Cmd.none )

        StartPan x y ->
            ( { model | isPanning = True, panStart = { x = x, y = y } }, Cmd.none )

        MovePan x y ->
            if model.isPanning then
                let
                    dx =
                        x - model.panStart.x

                    dy =
                        y - model.panStart.y

                    vp =
                        model.viewport
                in
                ( { model
                    | viewport = { vp | offsetX = vp.offsetX + dx, offsetY = vp.offsetY + dy }
                    , panStart = { x = x, y = y }
                  }
                , Cmd.none
                )

            else
                ( model, Cmd.none )

        StopPan ->
            ( { model | isPanning = False }, Cmd.none )

        RefreshGame ->
            ( model, fetchGame model.baseUrl model.token model.gameId )

        GoToLobby ->
            ( model, Cmd.none )

        -- 3D toggle
        Toggle3DView ->
            let
                newIs3D =
                    not model.is3DView

                newModel =
                    { model | is3DView = newIs3D }
            in
            ( newModel
            , Cmd.batch
                [ Port.set3DViewEnabled newIs3D
                , if newIs3D then
                    emitSceneState newModel

                  else
                    Cmd.none
                ]
            )

        -- 3D interactions (mapped to same logic as 2D)
        From3DBoardClick coord ->
            update (ClickBoardCell coord) model

        From3DRackClick idx ->
            update (SelectRackTile idx) model

        From3DPendingClick coord ->
            update (RemovePending coord) model


simulatePlay : Model -> List BoardTile -> Cmd Msg
simulatePlay model placements =
    let
        mapped =
            List.map (\bt -> { face = bt.face, coordinate = bt.coordinate }) placements
    in
    Api.Action.simulatePlay model.baseUrl model.token model.gameId mapped GotSimulation



-- 3D SCENE STATE


emitSceneState : Model -> Cmd Msg
emitSceneState model =
    if model.is3DView then
        Port.sendSceneState (encodeSceneState model)

    else
        Cmd.none


encodeSceneState : Model -> Encode.Value
encodeSceneState model =
    Encode.object
        [ ( "board", Encode.list encodeBoardTile model.board )
        , ( "pending", Encode.list encodeBoardTile model.pendingPlacements )
        , ( "lastPlayed"
          , Encode.list
                (\( x, y ) -> Encode.list Encode.int [ x, y ])
                (Set.toList model.lastPlayedCoords)
          )
        , ( "rack"
          , Encode.list
                (\( idx, rt ) ->
                    Encode.object
                        [ ( "index", Encode.int idx )
                        , ( "color", Encode.string (Types.Color.colorToString rt.face.color) )
                        , ( "shape", Encode.string (Types.Shape.shapeToString rt.face.shape) )
                        , ( "selected", Encode.bool (model.selectedRackIndex == Just idx) )
                        ]
                )
                (List.indexedMap Tuple.pair model.rack)
          )
        , ( "selectedRackIndex"
          , case model.selectedRackIndex of
                Just idx ->
                    Encode.int idx

                Nothing ->
                    Encode.null
          )
        ]


encodeBoardTile : BoardTile -> Encode.Value
encodeBoardTile bt =
    Encode.object
        [ ( "x", Encode.int bt.coordinate.x )
        , ( "y", Encode.int bt.coordinate.y )
        , ( "color", Encode.string (Types.Color.colorToString bt.face.color) )
        , ( "shape", Encode.string (Types.Shape.shapeToString bt.face.shape) )
        ]


-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ Port.onBoardCellClicked
            (\val ->
                case Decode.decodeValue coordDecoder val of
                    Ok coord ->
                        From3DBoardClick coord

                    Err _ ->
                        RefreshGame
            )
        , Port.onRackTileClicked From3DRackClick
        , Port.onPendingTileClicked
            (\val ->
                case Decode.decodeValue coordDecoder val of
                    Ok coord ->
                        From3DPendingClick coord

                    Err _ ->
                        RefreshGame
            )
        ]


coordDecoder : Decode.Decoder Coordinate
coordDecoder =
    Decode.map2 Coordinate
        (Decode.field "x" Decode.int)
        (Decode.field "y" Decode.int)



-- VIEW


view : String -> Model -> Html Msg
view pseudo model =
    div [ class "page game-page" ]
        [ viewHeader pseudo model
        , viewBoardArea model
        , viewSidebar pseudo model
        , div [ class "game-footer" ]
            [ viewRackArea model
            , viewActions model
            ]
        , viewWinnerOverlay model
        , viewErrorToast model
        ]


viewHeader : String -> Model -> Html Msg
viewHeader pseudo model =
    div [ class "game-header" ]
        [ h1 [ class "logo-small" ] [ text "QWIRKLE" ]
        , span [ class "game-id" ] [ text ("#" ++ String.fromInt model.gameId) ]
        , span [ class "turn-info" ]
            [ text
                (if model.currentTurnPseudo == pseudo then
                    "Your turn!"

                 else
                    displayName model.currentTurnPseudo ++ "'s turn"
                )
            ]
        , button [ onClick Toggle3DView, class "btn btn-small btn-3d-toggle" ]
            [ text
                (if model.is3DView then
                    "2D"

                 else
                    "3D"
                )
            ]
        , button [ onClick RefreshGame, class "btn btn-small" ] [ text "Refresh" ]
        , button [ onClick GoToLobby, class "btn btn-small" ] [ text "Lobby" ]
        ]


onWheel : (Float -> msg) -> Html.Attribute msg
onWheel toMsg =
    Html.Events.preventDefaultOn "wheel"
        (Decode.field "deltaY" Decode.float
            |> Decode.map (\dy -> ( toMsg dy, True ))
        )


onMouseDown : (Float -> Float -> msg) -> Html.Attribute msg
onMouseDown toMsg =
    Html.Events.on "mousedown"
        (Decode.map2 toMsg
            (Decode.field "clientX" Decode.float)
            (Decode.field "clientY" Decode.float)
        )


onMouseMove : (Float -> Float -> msg) -> Html.Attribute msg
onMouseMove toMsg =
    Html.Events.on "mousemove"
        (Decode.map2 toMsg
            (Decode.field "clientX" Decode.float)
            (Decode.field "clientY" Decode.float)
        )


onMouseUp : msg -> Html.Attribute msg
onMouseUp msg =
    Html.Events.on "mouseup" (Decode.succeed msg)


viewBoardArea : Model -> Html Msg
viewBoardArea model =
    if model.is3DView then
        div [ class "game-board game-board-3d", id "three-canvas-container" ] []

    else
        div
            [ class "game-board"
            , onWheel (\dy -> ZoomBoard -dy)
            , onMouseDown StartPan
            , onMouseMove MovePan
            , onMouseUp StopPan
            , Html.Events.on "mouseleave" (Decode.succeed StopPan)
            ]
            [ if model.loading then
                div [ class "loading" ] [ div [ class "spinner" ] [] ]

              else
                viewBoard
                    model.viewport
                    model.board
                    model.pendingPlacements
                    model.lastPlayedCoords
                    ClickBoardCell
                    RemovePending
            ]


viewSidebar : String -> Model -> Html Msg
viewSidebar pseudo model =
    div [ class "game-sidebar" ]
        [ viewScoreboard model.players pseudo
        , div [ class "bag-info" ]
            [ span [ class "bag-icon" ] [ text "🎒" ]
            , text (" " ++ String.fromInt model.bagCount ++ " tiles in bag")
            ]
        , case model.simulationScore of
            Just score ->
                div [ class "simulation-score" ]
                    [ text "Score: "
                    , span [ class "score-value-big" ] [ text (String.fromInt score) ]
                    ]

            Nothing ->
                case model.simulationCode of
                    Just code ->
                        div [ class "simulation-error" ] [ text code ]

                    Nothing ->
                        text ""
        ]


viewRackArea : Model -> Html Msg
viewRackArea model =
    div [ class "game-rack" ]
        [ if model.swapMode then
            div [ class "swap-header" ]
                [ span [] [ text "Select tiles to swap" ]
                , button [ onClick ConfirmSwap, class "btn btn-primary btn-small" ] [ text "Swap" ]
                , button [ onClick CancelSwap, class "btn btn-secondary btn-small" ] [ text "Cancel" ]
                ]

          else if not (List.isEmpty model.pendingPlacements) then
            div [ class "placement-header" ]
                [ span [ class "pending-count" ]
                    [ text (String.fromInt (List.length model.pendingPlacements) ++ " tile(s) placed") ]
                , button [ onClick UndoAllPlacements, class "btn btn-secondary btn-small" ] [ text "Undo all" ]
                ]

          else
            text ""
        , if not model.is3DView then
            viewRack model.rack
                (if model.swapMode then
                    model.swapSelected

                 else
                    case model.selectedRackIndex of
                        Just idx ->
                            [ idx ]

                        Nothing ->
                            []
                )
                SelectRackTile

          else
            text ""
        ]


viewActions : Model -> Html Msg
viewActions model =
    div [ class "game-actions" ]
        [ if not (List.isEmpty model.pendingPlacements) then
            button
                [ onClick ValidatePlay
                , class "btn btn-primary"
                , disabled (model.simulationScore == Nothing)
                ]
                [ text
                    (case model.simulationScore of
                        Just s ->
                            "Play (" ++ String.fromInt s ++ " pts)"

                        Nothing ->
                            "Play"
                    )
                ]

          else
            text ""
        , if not model.swapMode && List.isEmpty model.pendingPlacements then
            button [ onClick EnterSwapMode, class "btn btn-secondary" ] [ text "Swap tiles" ]

          else
            text ""
        , if not model.swapMode && List.isEmpty model.pendingPlacements then
            button [ onClick SkipTurn, class "btn btn-secondary" ] [ text "Skip turn" ]

          else
            text ""
        ]


viewWinnerOverlay : Model -> Html Msg
viewWinnerOverlay model =
    case model.winner of
        Just w ->
            div [ class "winner-overlay" ]
                [ div [ class "winner-card" ]
                    [ h2 [] [ text "Game Over!" ]
                    , p [] [ text (w ++ " wins!") ]
                    , button [ onClick GoToLobby, class "btn btn-primary" ] [ text "Back to Lobby" ]
                    ]
                ]

        Nothing ->
            text ""


viewErrorToast : Model -> Html Msg
viewErrorToast model =
    case model.error of
        Just err ->
            div [ class "error-toast" ] [ text err ]

        Nothing ->
            text ""



-- HELPERS


listGet : Int -> List a -> Maybe a
listGet idx list =
    list |> List.drop idx |> List.head


listRemoveAt : Int -> List a -> List a
listRemoveAt idx list =
    List.take idx list ++ List.drop (idx + 1) list
