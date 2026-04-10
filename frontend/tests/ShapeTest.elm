module ShapeTest exposing (..)

import Expect
import Json.Decode as Decode
import Json.Encode as Encode
import Test exposing (..)
import Types.Shape exposing (..)


suite : Test
suite =
    describe "Types.Shape"
        [ describe "shapeDecoder"
            [ test "decodes string Circle" <|
                \_ ->
                    Decode.decodeString shapeDecoder "\"Circle\""
                        |> Expect.equal (Ok Circle)
            , test "decodes string EightPointStar" <|
                \_ ->
                    Decode.decodeString shapeDecoder "\"EightPointStar\""
                        |> Expect.equal (Ok EightPointStar)
            , test "decodes int 3 as Diamond" <|
                \_ ->
                    Decode.decodeString shapeDecoder "3"
                        |> Expect.equal (Ok Diamond)
            , test "fails on unknown string" <|
                \_ ->
                    Decode.decodeString shapeDecoder "\"Triangle\""
                        |> Expect.err
            ]
        , describe "roundtrip"
            [ test "encode then decode all shapes" <|
                \_ ->
                    let
                        shapes =
                            [ Circle, Square, Diamond, Clover, FourPointStar, EightPointStar ]

                        roundtrip s =
                            shapeEncoder s
                                |> Encode.encode 0
                                |> Decode.decodeString shapeDecoder
                    in
                    List.map roundtrip shapes
                        |> Expect.equal (List.map Ok shapes)
            ]
        ]
