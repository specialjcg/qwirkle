module Page.Lobby exposing (Model, Msg(..), init, update, view)

import Api.Http exposing (authDelete, authGet)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, stopPropagationOn)
import Http
import Json.Decode as Decode
import Types.Game exposing (GameState, gameStateDecoder)
import Types.Player exposing (Player, displayName)
import Types.Tile exposing (BoardTile)


type alias Model =
    { gameIds : List Int
    , gamePreviews : List GamePreview
    , loading : Bool
    , error : Maybe String
    , baseUrl : String
    , token : String
    }


type alias GamePreview =
    { id : Int
    , players : List Player
    , tileCount : Int
    , status : String
    }


type Msg
    = GotGameIds (Result Http.Error (List Int))
    | GotGamePreview Int (Result Http.Error GameState)
    | SelectGame Int
    | NewGameVsBot
    | NewGameVsMctsBot
    | WatchBotsBattle
    | GoToOpponents
    | InstantGame Int
    | Logout
    | DeleteGame Int
    | GotDeleteGame Int (Result Http.Error ())


init : String -> String -> ( Model, Cmd Msg )
init baseUrl token =
    ( { gameIds = []
      , gamePreviews = []
      , loading = True
      , error = Nothing
      , baseUrl = baseUrl
      , token = token
      }
    , fetchGameIds baseUrl token
    )


fetchGameIds : String -> String -> Cmd Msg
fetchGameIds baseUrl token =
    authGet baseUrl token "/api/games" (Decode.list Decode.int) GotGameIds


fetchGamePreview : String -> String -> Int -> Cmd Msg
fetchGamePreview baseUrl token gameId =
    authGet baseUrl token
        ("/api/games/" ++ String.fromInt gameId)
        gameStateDecoder
        (GotGamePreview gameId)


deleteGame : String -> String -> Int -> Cmd Msg
deleteGame baseUrl token gameId =
    authDelete baseUrl token
        ("/api/games/" ++ String.fromInt gameId)
        (GotDeleteGame gameId)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotGameIds (Ok ids) ->
            let
                previewIds =
                    List.take 12 ids

                cmds =
                    List.map (fetchGamePreview model.baseUrl model.token) previewIds
            in
            ( { model | gameIds = ids, loading = False }
            , Cmd.batch cmds
            )

        GotGameIds (Err _) ->
            ( { model | error = Just "Failed to load games", loading = False }, Cmd.none )

        GotGamePreview gameId (Ok state) ->
            let
                preview =
                    { id = gameId
                    , players = state.players
                    , tileCount = List.length state.board
                    , status =
                        if List.any .isTurn state.players then
                            let
                                currentPlayer =
                                    state.players |> List.filter .isTurn |> List.head
                            in
                            case currentPlayer of
                                Just p ->
                                    displayName p.pseudo ++ "'s turn"

                                Nothing ->
                                    "In progress"

                        else
                            "Finished"
                    }
            in
            ( { model | gamePreviews = model.gamePreviews ++ [ preview ] }, Cmd.none )

        GotGamePreview _ (Err _) ->
            ( model, Cmd.none )

        DeleteGame gameId ->
            ( model, deleteGame model.baseUrl model.token gameId )

        GotDeleteGame gameId (Ok _) ->
            ( { model
                | gamePreviews = List.filter (\p -> p.id /= gameId) model.gamePreviews
                , gameIds = List.filter (\id -> id /= gameId) model.gameIds
              }
            , Cmd.none
            )

        GotDeleteGame _ (Err _) ->
            ( { model | error = Just "Failed to delete game" }, Cmd.none )

        _ ->
            -- Navigation messages handled by Main
            ( model, Cmd.none )


view : String -> Model -> Html Msg
view pseudo model =
    div [ class "page lobby-page" ]
        [ div [ class "lobby-header" ]
            [ h1 [ class "logo" ] [ text "QWIRKLE" ]
            , div [ class "user-info" ]
                [ span [ class "pseudo" ] [ text pseudo ]
                , button [ onClick Logout, class "btn btn-small" ] [ text "Logout" ]
                ]
            ]
        , div [ class "lobby-actions" ]
            [ button [ onClick NewGameVsBot, class "btn btn-primary" ] [ text "vs Greedy bot" ]
            , button [ onClick NewGameVsMctsBot, class "btn btn-primary" ] [ text "vs Neural bot" ]
            , button [ onClick WatchBotsBattle, class "btn btn-accent" ] [ text "Watch: Greedy vs Neural" ]
            , button [ onClick GoToOpponents, class "btn btn-secondary" ] [ text "New Game" ]
            , div [ class "instant-games" ]
                [ span [ class "instant-label" ] [ text "Quick match" ]
                , button [ onClick (InstantGame 2), class "btn btn-accent btn-small" ] [ text "2P" ]
                , button [ onClick (InstantGame 3), class "btn btn-accent btn-small" ] [ text "3P" ]
                , button [ onClick (InstantGame 4), class "btn btn-accent btn-small" ] [ text "4P" ]
                ]
            ]
        , case model.error of
            Just err ->
                div [ class "error-banner" ] [ text err ]

            Nothing ->
                text ""
        , if model.loading then
            div [ class "loading" ] [ div [ class "spinner" ] [] ]

          else if List.isEmpty model.gamePreviews && List.isEmpty model.gameIds then
            div [ class "empty-state" ]
                [ h2 [] [ text "No games yet" ]
                , p [] [ text "Start a new game to begin playing!" ]
                ]

          else
            div [ class "games-grid" ]
                (List.map viewGamePreview model.gamePreviews)
        ]


viewGamePreview : GamePreview -> Html Msg
viewGamePreview preview =
    div [ class "game-card", onClick (SelectGame preview.id) ]
        [ div [ class "game-card-header" ]
            [ span [ class "game-card-id" ] [ text ("#" ++ String.fromInt preview.id) ]
            , span [ class "game-card-status" ] [ text preview.status ]
            , button
                [ class "btn-delete"
                , stopPropagationOn "click"
                    (Decode.succeed ( DeleteGame preview.id, True ))
                , title "Delete game"
                ]
                [ text "\u{00D7}" ]
            ]
        , div [ class "game-card-players" ]
            (List.map viewPlayerBadge preview.players)
        , div [ class "game-card-info" ]
            [ span [ class "tile-count" ]
                [ text (String.fromInt preview.tileCount ++ " tiles on board") ]
            ]
        , div [ class "game-card-scores" ]
            (List.map
                (\p ->
                    div [ class "mini-score" ]
                        [ span [] [ text (displayName p.pseudo) ]
                        , span [ class "score-value" ] [ text (String.fromInt p.points) ]
                        ]
                )
                preview.players
            )
        ]


viewPlayerBadge : Player -> Html Msg
viewPlayerBadge player =
    span
        [ class
            ("player-badge"
                ++ (if player.isTurn then
                        " active-turn"

                    else
                        ""
                   )
            )
        ]
        [ text (displayName player.pseudo) ]
