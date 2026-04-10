module Types.Game exposing (GameState, gameStateDecoder)

import Json.Decode as Decode exposing (Decoder)
import Types.Player exposing (Player, playerDecoder)
import Types.Tile exposing (BoardTile, boardTileDecoder)


type alias GameState =
    { id : Int
    , board : List BoardTile
    , players : List Player
    , bagCount : Int
    }


gameStateDecoder : Decoder GameState
gameStateDecoder =
    Decode.map4 GameState
        (Decode.field "id" Decode.int)
        (Decode.field "board" (Decode.list boardTileDecoder))
        (Decode.field "players" (Decode.list playerDecoder))
        (Decode.field "bag_count" Decode.int)
