module GamePageTest exposing (..)

import Expect
import Page.Game as Game exposing (Model, Msg(..))
import Set
import Test exposing (..)
import Types.Color exposing (Color(..))
import Types.Shape exposing (Shape(..))
import Types.Tile exposing (BoardTile, Coordinate, RackTile, TileFace)
import View.Board exposing (defaultViewport)


initModel : Model
initModel =
    { gameId = 1
    , baseUrl = "http://test"
    , token = "fake-token"
    , board =
        [ { face = { color = Red, shape = Circle }
          , coordinate = { x = 0, y = 0 }
          }
        ]
    , rack =
        [ { face = { color = Red, shape = Square }, rackPosition = 0 }
        , { face = { color = Blue, shape = Diamond }, rackPosition = 1 }
        , { face = { color = Green, shape = Clover }, rackPosition = 2 }
        ]
    , players = []
    , bagCount = 90
    , currentTurnPseudo = "Alice"
    , myPseudo = ""
    , winner = Nothing
    , loading = False
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
    }


suite : Test
suite =
    describe "Page.Game update logic"
        [ describe "rack selection"
            [ test "selecting a rack tile stores the index" <|
                \_ ->
                    let
                        ( model, _ ) =
                            Game.update (SelectRackTile 1) initModel
                    in
                    Expect.equal (Just 1) model.selectedRackIndex
            , test "selecting same tile again deselects" <|
                \_ ->
                    let
                        m =
                            { initModel | selectedRackIndex = Just 1 }

                        ( model, _ ) =
                            Game.update (SelectRackTile 1) m
                    in
                    Expect.equal Nothing model.selectedRackIndex
            , test "selecting different tile switches" <|
                \_ ->
                    let
                        m =
                            { initModel | selectedRackIndex = Just 0 }

                        ( model, _ ) =
                            Game.update (SelectRackTile 2) m
                    in
                    Expect.equal (Just 2) model.selectedRackIndex
            ]
        , describe "tile placement"
            [ test "clicking board cell with selected tile places it" <|
                \_ ->
                    let
                        m =
                            { initModel | selectedRackIndex = Just 0 }

                        ( model, _ ) =
                            Game.update (ClickBoardCell { x = 1, y = 0 }) m
                    in
                    Expect.all
                        [ \md -> Expect.equal 1 (List.length md.pendingPlacements)
                        , \md -> Expect.equal 2 (List.length md.rack)
                        , \md -> Expect.equal Nothing md.selectedRackIndex
                        ]
                        model
            , test "clicking board cell without selection does nothing" <|
                \_ ->
                    let
                        ( model, _ ) =
                            Game.update (ClickBoardCell { x = 1, y = 0 }) initModel
                    in
                    Expect.all
                        [ \md -> Expect.equal 0 (List.length md.pendingPlacements)
                        , \md -> Expect.equal 3 (List.length md.rack)
                        ]
                        model
            ]
        , describe "undo placements"
            [ test "undo returns tiles to rack" <|
                \_ ->
                    let
                        m =
                            { initModel
                                | pendingPlacements =
                                    [ { face = { color = Red, shape = Square }
                                      , coordinate = { x = 1, y = 0 }
                                      }
                                    ]
                                , rack =
                                    [ { face = { color = Blue, shape = Diamond }, rackPosition = 1 }
                                    ]
                            }

                        ( model, _ ) =
                            Game.update UndoAllPlacements m
                    in
                    Expect.all
                        [ \md -> Expect.equal 0 (List.length md.pendingPlacements)
                        , \md -> Expect.equal 2 (List.length md.rack)
                        , \md -> Expect.equal Nothing md.simulationScore
                        ]
                        model
            ]
        , describe "swap mode"
            [ test "entering swap mode clears selection" <|
                \_ ->
                    let
                        m =
                            { initModel | selectedRackIndex = Just 1 }

                        ( model, _ ) =
                            Game.update EnterSwapMode m
                    in
                    Expect.all
                        [ \md -> Expect.equal True md.swapMode
                        , \md -> Expect.equal [] md.swapSelected
                        , \md -> Expect.equal Nothing md.selectedRackIndex
                        ]
                        model
            , test "selecting tiles in swap mode toggles them" <|
                \_ ->
                    let
                        m =
                            { initModel | swapMode = True }

                        ( m1, _ ) =
                            Game.update (SelectRackTile 0) m

                        ( m2, _ ) =
                            Game.update (SelectRackTile 2) m1

                        ( m3, _ ) =
                            Game.update (SelectRackTile 0) m2
                    in
                    Expect.all
                        [ \_ -> Expect.equal [ 0 ] m1.swapSelected
                        , \_ -> Expect.equal [ 2, 0 ] m2.swapSelected
                        , \_ -> Expect.equal [ 2 ] m3.swapSelected
                        ]
                        ()
            , test "cancelling swap mode resets" <|
                \_ ->
                    let
                        m =
                            { initModel | swapMode = True, swapSelected = [ 0, 1 ] }

                        ( model, _ ) =
                            Game.update CancelSwap m
                    in
                    Expect.all
                        [ \md -> Expect.equal False md.swapMode
                        , \md -> Expect.equal [] md.swapSelected
                        ]
                        model
            ]
        , describe "SSE events"
            [ test "turn changed updates pseudo" <|
                \_ ->
                    let
                        ( model, _ ) =
                            Game.update
                                (SseTurnChanged { playerId = 2, pseudo = "Bob" })
                                initModel
                    in
                    Expect.equal "Bob" model.currentTurnPseudo
            , test "game over sets winner" <|
                \_ ->
                    let
                        m =
                            { initModel
                                | players =
                                    [ { id = 1
                                      , pseudo = "Alice"
                                      , gamePosition = 0
                                      , points = 50
                                      , lastTurnPoints = 5
                                      , rack = []
                                      , isTurn = False
                                      }
                                    ]
                            }

                        ( model, _ ) =
                            Game.update (SseGameOver { winnerIds = [ 1 ] }) m
                    in
                    Expect.equal (Just "Alice") model.winner
            , test "tiles played updates board" <|
                \_ ->
                    let
                        newTile =
                            { face = { color = Blue, shape = Square }
                            , coordinate = { x = 1, y = 0 }
                            }

                        ( model, _ ) =
                            Game.update
                                (SseTilesPlayed
                                    { playerId = 2
                                    , points = 3
                                    , tiles = [ newTile ]
                                    }
                                )
                                initModel
                    in
                    Expect.all
                        [ \md -> Expect.equal 2 (List.length md.board)
                        , \md -> Expect.equal True (Set.member ( 1, 0 ) md.lastPlayedCoords)
                        ]
                        model
            ]
        , describe "zoom"
            [ test "zoom in increases scale" <|
                \_ ->
                    let
                        ( model, _ ) =
                            Game.update (ZoomBoard 100) initModel
                    in
                    Expect.greaterThan 1.0 model.viewport.scale
            , test "zoom out decreases scale" <|
                \_ ->
                    let
                        ( model, _ ) =
                            Game.update (ZoomBoard -100) initModel
                    in
                    Expect.lessThan 1.0 model.viewport.scale
            , test "zoom is clamped" <|
                \_ ->
                    let
                        ( model, _ ) =
                            Game.update (ZoomBoard 99999) initModel
                    in
                    Expect.atMost 3.0 model.viewport.scale
            ]
        ]
