module Sse exposing (SseEvent(..), decodeSseEvent)

{-| Decode SSE events received from the backend via ports.
-}

import Json.Decode as Decode exposing (Decoder)
import Types.Tile exposing (BoardTile, boardTileDecoder)


type SseEvent
    = TilesPlayed { playerId : Int, points : Int, tiles : List BoardTile }
    | TilesSwapped { playerId : Int }
    | TurnChanged { playerId : Int, pseudo : String }
    | GameOver { winnerIds : List Int }
    | PlayerJoined { playerId : Int, pseudo : String }
    | InstantGameStarted { gameId : Int }
    | UnknownEvent String


decodeSseEvent : String -> SseEvent
decodeSseEvent json =
    case Decode.decodeString sseEventDecoder json of
        Ok event ->
            event

        Err _ ->
            UnknownEvent json


sseEventDecoder : Decoder SseEvent
sseEventDecoder =
    Decode.field "type" Decode.string
        |> Decode.andThen sseEventByType


sseEventByType : String -> Decoder SseEvent
sseEventByType eventType =
    case eventType of
        "tiles_played" ->
            Decode.field "data" tilesPlayedDecoder

        "tiles_swapped" ->
            Decode.field "data" tilesSwappedDecoder

        "turn_changed" ->
            Decode.field "data" turnChangedDecoder

        "game_over" ->
            Decode.field "data" gameOverDecoder

        "player_joined" ->
            Decode.field "data" playerJoinedDecoder

        "instant_game_started" ->
            Decode.field "data" instantGameStartedDecoder

        other ->
            Decode.succeed (UnknownEvent other)


tilesPlayedDecoder : Decoder SseEvent
tilesPlayedDecoder =
    Decode.map3 (\pid pts tiles -> TilesPlayed { playerId = pid, points = pts, tiles = tiles })
        (Decode.field "player_id" Decode.int)
        (Decode.field "points" Decode.int)
        (Decode.field "tiles" (Decode.list boardTileDecoder))


tilesSwappedDecoder : Decoder SseEvent
tilesSwappedDecoder =
    Decode.map (\pid -> TilesSwapped { playerId = pid })
        (Decode.field "player_id" Decode.int)


turnChangedDecoder : Decoder SseEvent
turnChangedDecoder =
    Decode.map2 (\pid pseudo -> TurnChanged { playerId = pid, pseudo = pseudo })
        (Decode.field "player_id" Decode.int)
        (Decode.field "pseudo" Decode.string)


gameOverDecoder : Decoder SseEvent
gameOverDecoder =
    Decode.map (\ids -> GameOver { winnerIds = ids })
        (Decode.field "winner_ids" (Decode.list Decode.int))


playerJoinedDecoder : Decoder SseEvent
playerJoinedDecoder =
    Decode.map2 (\pid pseudo -> PlayerJoined { playerId = pid, pseudo = pseudo })
        (Decode.field "player_id" Decode.int)
        (Decode.field "pseudo" Decode.string)


instantGameStartedDecoder : Decoder SseEvent
instantGameStartedDecoder =
    Decode.map (\gid -> InstantGameStarted { gameId = gid })
        (Decode.field "game_id" Decode.int)
