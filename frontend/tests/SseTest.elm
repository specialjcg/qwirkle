module SseTest exposing (..)

import Expect
import Sse exposing (..)
import Test exposing (..)
import Types.Color exposing (Color(..))
import Types.Shape exposing (Shape(..))


suite : Test
suite =
    describe "Sse"
        [ describe "decodeSseEvent"
            [ test "decodes tiles_played" <|
                \_ ->
                    let
                        json =
                            """{"type":"tiles_played","data":{"player_id":1,"points":5,"tiles":[{"face":{"color":"Red","shape":"Circle"},"coordinate":{"x":0,"y":0}}]}}"""
                    in
                    case decodeSseEvent json of
                        TilesPlayed data ->
                            Expect.all
                                [ \d -> Expect.equal 1 d.playerId
                                , \d -> Expect.equal 5 d.points
                                , \d -> Expect.equal 1 (List.length d.tiles)
                                ]
                                data

                        other ->
                            Expect.fail ("Expected TilesPlayed, got: " ++ Debug.toString other)
            , test "decodes turn_changed" <|
                \_ ->
                    let
                        json =
                            """{"type":"turn_changed","data":{"player_id":2,"pseudo":"Bob"}}"""
                    in
                    case decodeSseEvent json of
                        TurnChanged data ->
                            Expect.all
                                [ \d -> Expect.equal 2 d.playerId
                                , \d -> Expect.equal "Bob" d.pseudo
                                ]
                                data

                        other ->
                            Expect.fail ("Expected TurnChanged, got: " ++ Debug.toString other)
            , test "decodes game_over" <|
                \_ ->
                    let
                        json =
                            """{"type":"game_over","data":{"winner_ids":[1,3]}}"""
                    in
                    case decodeSseEvent json of
                        GameOver data ->
                            Expect.equal [ 1, 3 ] data.winnerIds

                        other ->
                            Expect.fail ("Expected GameOver, got: " ++ Debug.toString other)
            , test "decodes tiles_swapped" <|
                \_ ->
                    let
                        json =
                            """{"type":"tiles_swapped","data":{"player_id":4}}"""
                    in
                    case decodeSseEvent json of
                        TilesSwapped data ->
                            Expect.equal 4 data.playerId

                        other ->
                            Expect.fail ("Expected TilesSwapped, got: " ++ Debug.toString other)
            , test "decodes instant_game_started" <|
                \_ ->
                    let
                        json =
                            """{"type":"instant_game_started","data":{"game_id":99}}"""
                    in
                    case decodeSseEvent json of
                        InstantGameStarted data ->
                            Expect.equal 99 data.gameId

                        other ->
                            Expect.fail ("Expected InstantGameStarted, got: " ++ Debug.toString other)
            , test "unknown event type returns UnknownEvent" <|
                \_ ->
                    case decodeSseEvent """{"type":"something_new","data":{}}""" of
                        UnknownEvent _ ->
                            Expect.pass

                        other ->
                            Expect.fail ("Expected UnknownEvent, got: " ++ Debug.toString other)
            , test "invalid json returns UnknownEvent" <|
                \_ ->
                    case decodeSseEvent "not json at all" of
                        UnknownEvent _ ->
                            Expect.pass

                        other ->
                            Expect.fail ("Expected UnknownEvent, got: " ++ Debug.toString other)
            ]
        ]
