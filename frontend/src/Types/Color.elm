module Types.Color exposing (Color(..), colorDecoder, colorEncoder, colorToString, colorToCss)

import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Encode


type Color
    = Green
    | Blue
    | Purple
    | Red
    | Orange
    | Yellow


colorDecoder : Decoder Color
colorDecoder =
    Decode.oneOf
        [ Decode.string
            |> Decode.andThen
                (\s ->
                    case s of
                        "Green" ->
                            Decode.succeed Green

                        "Blue" ->
                            Decode.succeed Blue

                        "Purple" ->
                            Decode.succeed Purple

                        "Red" ->
                            Decode.succeed Red

                        "Orange" ->
                            Decode.succeed Orange

                        "Yellow" ->
                            Decode.succeed Yellow

                        _ ->
                            Decode.fail ("Unknown color: " ++ s)
                )
        , Decode.int
            |> Decode.andThen
                (\n ->
                    case n of
                        1 ->
                            Decode.succeed Green

                        2 ->
                            Decode.succeed Blue

                        3 ->
                            Decode.succeed Purple

                        4 ->
                            Decode.succeed Red

                        5 ->
                            Decode.succeed Orange

                        6 ->
                            Decode.succeed Yellow

                        _ ->
                            Decode.fail ("Unknown color: " ++ String.fromInt n)
                )
        ]


colorEncoder : Color -> Encode.Value
colorEncoder color =
    Encode.string (colorToString color)


colorToInt : Color -> Int
colorToInt color =
    case color of
        Green ->
            1

        Blue ->
            2

        Purple ->
            3

        Red ->
            4

        Orange ->
            5

        Yellow ->
            6


colorToString : Color -> String
colorToString color =
    case color of
        Green ->
            "Green"

        Blue ->
            "Blue"

        Purple ->
            "Purple"

        Red ->
            "Red"

        Orange ->
            "Orange"

        Yellow ->
            "Yellow"


colorToCss : Color -> String
colorToCss color =
    case color of
        Green ->
            "#2ecc71"

        Blue ->
            "#3498db"

        Purple ->
            "#9b59b6"

        Red ->
            "#e74c3c"

        Orange ->
            "#e67e22"

        Yellow ->
            "#f1c40f"
