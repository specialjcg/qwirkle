module Api.InstantGame exposing (InstantGameResponse, join)

import Api.Http exposing (authPost)
import Http
import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Encode


type alias InstantGameResponse =
    { status : String
    , gameId : Maybe Int
    }


instantGameResponseDecoder : Decoder InstantGameResponse
instantGameResponseDecoder =
    Decode.map2 InstantGameResponse
        (Decode.field "status" Decode.string)
        (Decode.maybe (Decode.field "game_id" Decode.int))


join : String -> String -> Int -> (Result Http.Error InstantGameResponse -> msg) -> Cmd msg
join baseUrl token playersNumber toMsg =
    authPost baseUrl token
        ("/api/instant-game/join/" ++ String.fromInt playersNumber)
        (Encode.object [])
        instantGameResponseDecoder
        toMsg
