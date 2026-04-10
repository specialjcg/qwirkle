module Api.Game exposing (CreateGameResponse, createGame, createSpectateGame, fetchGame, fetchGameIds)

import Api.Http exposing (authGet, authPost)
import Http
import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Encode
import Types.Game exposing (GameState, gameStateDecoder)


fetchGameIds : String -> String -> (Result Http.Error (List Int) -> msg) -> Cmd msg
fetchGameIds baseUrl token toMsg =
    authGet baseUrl token "/api/games" (Decode.list Decode.int) toMsg


fetchGame : String -> String -> Int -> (Result Http.Error GameState -> msg) -> Cmd msg
fetchGame baseUrl token gameId toMsg =
    authGet baseUrl token ("/api/games/" ++ String.fromInt gameId) gameStateDecoder toMsg


type alias CreateGameResponse =
    { gameId : Int
    }


createGameResponseDecoder : Decoder CreateGameResponse
createGameResponseDecoder =
    Decode.map CreateGameResponse
        (Decode.field "game_id" Decode.int)


createGame : String -> String -> List String -> (Result Http.Error CreateGameResponse -> msg) -> Cmd msg
createGame baseUrl token opponents toMsg =
    authPost baseUrl token "/api/games"
        (Encode.object
            [ ( "opponents", Encode.list Encode.string opponents )
            ]
        )
        createGameResponseDecoder
        toMsg


createSpectateGame : String -> String -> List String -> (Result Http.Error CreateGameResponse -> msg) -> Cmd msg
createSpectateGame baseUrl token bots toMsg =
    authPost baseUrl token "/api/games/spectate"
        (Encode.object
            [ ( "bots", Encode.list Encode.string bots )
            ]
        )
        createGameResponseDecoder
        toMsg
