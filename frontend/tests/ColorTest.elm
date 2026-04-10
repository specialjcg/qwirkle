module ColorTest exposing (..)

import Expect
import Json.Decode as Decode
import Json.Encode as Encode
import Test exposing (..)
import Types.Color exposing (..)


suite : Test
suite =
    describe "Types.Color"
        [ describe "colorDecoder"
            [ test "decodes string Green" <|
                \_ ->
                    Decode.decodeString colorDecoder "\"Green\""
                        |> Expect.equal (Ok Green)
            , test "decodes string Red" <|
                \_ ->
                    Decode.decodeString colorDecoder "\"Red\""
                        |> Expect.equal (Ok Red)
            , test "decodes int 1 as Green" <|
                \_ ->
                    Decode.decodeString colorDecoder "1"
                        |> Expect.equal (Ok Green)
            , test "decodes int 6 as Yellow" <|
                \_ ->
                    Decode.decodeString colorDecoder "6"
                        |> Expect.equal (Ok Yellow)
            , test "fails on unknown string" <|
                \_ ->
                    Decode.decodeString colorDecoder "\"Pink\""
                        |> Expect.err
            , test "fails on unknown int" <|
                \_ ->
                    Decode.decodeString colorDecoder "99"
                        |> Expect.err
            ]
        , describe "colorEncoder"
            [ test "encodes Green as string" <|
                \_ ->
                    colorEncoder Green
                        |> Encode.encode 0
                        |> Expect.equal "\"Green\""
            , test "encodes Yellow as string" <|
                \_ ->
                    colorEncoder Yellow
                        |> Encode.encode 0
                        |> Expect.equal "\"Yellow\""
            ]
        , describe "roundtrip"
            [ test "encode then decode all colors" <|
                \_ ->
                    let
                        colors =
                            [ Green, Blue, Purple, Red, Orange, Yellow ]

                        roundtrip c =
                            colorEncoder c
                                |> Encode.encode 0
                                |> Decode.decodeString colorDecoder
                    in
                    List.map roundtrip colors
                        |> Expect.equal (List.map Ok colors)
            ]
        , describe "colorToCss"
            [ test "Green is #2ecc71" <|
                \_ ->
                    colorToCss Green |> Expect.equal "#2ecc71"
            , test "Red is #e74c3c" <|
                \_ ->
                    colorToCss Red |> Expect.equal "#e74c3c"
            ]
        ]
