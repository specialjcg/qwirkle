module TileTest exposing (..)

import Expect
import Json.Decode as Decode
import Json.Encode as Encode
import Test exposing (..)
import Types.Color exposing (Color(..))
import Types.Shape exposing (Shape(..))
import Types.Tile exposing (..)


suite : Test
suite =
    describe "Types.Tile"
        [ describe "tileFaceDecoder"
            [ test "decodes a tile face with string enums" <|
                \_ ->
                    let
                        json =
                            """{"color":"Red","shape":"Circle"}"""
                    in
                    Decode.decodeString tileFaceDecoder json
                        |> Expect.equal (Ok { color = Red, shape = Circle })
            , test "decodes a tile face with int enums" <|
                \_ ->
                    let
                        json =
                            """{"color":2,"shape":4}"""
                    in
                    Decode.decodeString tileFaceDecoder json
                        |> Expect.equal (Ok { color = Blue, shape = Clover })
            ]
        , describe "tileFaceEncoder"
            [ test "encodes tile face as string enums" <|
                \_ ->
                    let
                        face =
                            { color = Purple, shape = Diamond }

                        encoded =
                            tileFaceEncoder face |> Encode.encode 0
                    in
                    Decode.decodeString tileFaceDecoder encoded
                        |> Expect.equal (Ok face)
            ]
        , describe "coordinateDecoder"
            [ test "decodes coordinate" <|
                \_ ->
                    Decode.decodeString coordinateDecoder """{"x":3,"y":-1}"""
                        |> Expect.equal (Ok { x = 3, y = -1 })
            ]
        , describe "coordinateEncoder"
            [ test "roundtrip coordinate" <|
                \_ ->
                    let
                        coord =
                            { x = -5, y = 10 }
                    in
                    coordinateEncoder coord
                        |> Encode.encode 0
                        |> Decode.decodeString coordinateDecoder
                        |> Expect.equal (Ok coord)
            ]
        , describe "boardTileDecoder"
            [ test "decodes board tile" <|
                \_ ->
                    let
                        json =
                            """{"face":{"color":"Green","shape":"Square"},"coordinate":{"x":0,"y":0}}"""
                    in
                    Decode.decodeString boardTileDecoder json
                        |> Expect.equal
                            (Ok
                                { face = { color = Green, shape = Square }
                                , coordinate = { x = 0, y = 0 }
                                }
                            )
            ]
        , describe "rackTileDecoder"
            [ test "decodes rack tile" <|
                \_ ->
                    let
                        json =
                            """{"face":{"color":"Yellow","shape":"FourPointStar"},"rack_position":2}"""
                    in
                    Decode.decodeString rackTileDecoder json
                        |> Expect.equal
                            (Ok
                                { face = { color = Yellow, shape = FourPointStar }
                                , rackPosition = 2
                                }
                            )
            ]
        ]
