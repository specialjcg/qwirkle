module Types.Shape exposing (Shape(..), shapeDecoder, shapeEncoder, shapeToString)

import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Encode


type Shape
    = Circle
    | Square
    | Diamond
    | Clover
    | FourPointStar
    | EightPointStar


shapeDecoder : Decoder Shape
shapeDecoder =
    Decode.oneOf
        [ Decode.string
            |> Decode.andThen
                (\s ->
                    case s of
                        "Circle" ->
                            Decode.succeed Circle

                        "Square" ->
                            Decode.succeed Square

                        "Diamond" ->
                            Decode.succeed Diamond

                        "Clover" ->
                            Decode.succeed Clover

                        "FourPointStar" ->
                            Decode.succeed FourPointStar

                        "EightPointStar" ->
                            Decode.succeed EightPointStar

                        _ ->
                            Decode.fail ("Unknown shape: " ++ s)
                )
        , Decode.int
            |> Decode.andThen
                (\n ->
                    case n of
                        1 ->
                            Decode.succeed Circle

                        2 ->
                            Decode.succeed Square

                        3 ->
                            Decode.succeed Diamond

                        4 ->
                            Decode.succeed Clover

                        5 ->
                            Decode.succeed FourPointStar

                        6 ->
                            Decode.succeed EightPointStar

                        _ ->
                            Decode.fail ("Unknown shape: " ++ String.fromInt n)
                )
        ]


shapeEncoder : Shape -> Encode.Value
shapeEncoder shape =
    Encode.string (shapeToString shape)


shapeToInt : Shape -> Int
shapeToInt shape =
    case shape of
        Circle ->
            1

        Square ->
            2

        Diamond ->
            3

        Clover ->
            4

        FourPointStar ->
            5

        EightPointStar ->
            6


shapeToString : Shape -> String
shapeToString shape =
    case shape of
        Circle ->
            "Circle"

        Square ->
            "Square"

        Diamond ->
            "Diamond"

        Clover ->
            "Clover"

        FourPointStar ->
            "FourPointStar"

        EightPointStar ->
            "EightPointStar"
