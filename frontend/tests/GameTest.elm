module GameTest exposing (..)

import Expect
import Json.Decode as Decode
import Test exposing (..)
import Types.Color exposing (Color(..))
import Types.Game exposing (gameStateDecoder)
import Types.Shape exposing (Shape(..))


suite : Test
suite =
    describe "Types.Game"
        [ describe "gameStateDecoder"
            [ test "decodes a full game state" <|
                \_ ->
                    let
                        json =
                            """{
                                "id": 42,
                                "board": [
                                    {"face": {"color": "Red", "shape": "Circle"}, "coordinate": {"x": 0, "y": 0}},
                                    {"face": {"color": "Red", "shape": "Square"}, "coordinate": {"x": 1, "y": 0}}
                                ],
                                "players": [
                                    {
                                        "id": 1,
                                        "pseudo": "Alice",
                                        "game_position": 0,
                                        "points": 10,
                                        "last_turn_points": 3,
                                        "rack": [
                                            {"face": {"color": "Blue", "shape": "Diamond"}, "rack_position": 0}
                                        ],
                                        "is_turn": true
                                    }
                                ],
                                "bag_count": 90
                            }"""
                    in
                    case Decode.decodeString gameStateDecoder json of
                        Ok state ->
                            Expect.all
                                [ \s -> Expect.equal 42 s.id
                                , \s -> Expect.equal 2 (List.length s.board)
                                , \s -> Expect.equal 1 (List.length s.players)
                                , \s -> Expect.equal 90 s.bagCount
                                , \s ->
                                    case List.head s.players of
                                        Just p ->
                                            Expect.all
                                                [ \pp -> Expect.equal "Alice" pp.pseudo
                                                , \pp -> Expect.equal 10 pp.points
                                                , \pp -> Expect.equal True pp.isTurn
                                                , \pp -> Expect.equal 1 (List.length pp.rack)
                                                ]
                                                p

                                        Nothing ->
                                            Expect.fail "Expected at least one player"
                                ]
                                state

                        Err e ->
                            Expect.fail (Decode.errorToString e)
            , test "decodes empty game state" <|
                \_ ->
                    let
                        json =
                            """{"id":1,"board":[],"players":[],"bag_count":108}"""
                    in
                    case Decode.decodeString gameStateDecoder json of
                        Ok state ->
                            Expect.all
                                [ \s -> Expect.equal 1 s.id
                                , \s -> Expect.equal 0 (List.length s.board)
                                , \s -> Expect.equal 108 s.bagCount
                                ]
                                state

                        Err e ->
                            Expect.fail (Decode.errorToString e)
            ]
        ]
