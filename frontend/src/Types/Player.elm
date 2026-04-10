module Types.Player exposing (Player, displayName, isBot, playerDecoder)

import Json.Decode as Decode exposing (Decoder)
import Types.Tile exposing (RackTile, rackTileDecoder)


type alias Player =
    { id : Int
    , pseudo : String
    , gamePosition : Int
    , points : Int
    , lastTurnPoints : Int
    , rack : List RackTile
    , isTurn : Bool
    }


playerDecoder : Decoder Player
playerDecoder =
    Decode.map7 Player
        (Decode.field "id" Decode.int)
        (Decode.field "pseudo" Decode.string)
        (Decode.field "game_position" Decode.int)
        (Decode.field "points" Decode.int)
        (Decode.field "last_turn_points" Decode.int)
        (Decode.field "rack" (Decode.list rackTileDecoder))
        (Decode.field "is_turn" Decode.bool)


{-| Convert internal pseudo (bot1, bot2, ...) to a display-friendly name.
-}
displayName : String -> String
displayName pseudo =
    case pseudo of
        "bot1" ->
            "🤖 Greedy"

        "bot2" ->
            "🧠 Neural"

        "bot3" ->
            "🤖 Bot 3"

        other ->
            other


isBot : String -> Bool
isBot pseudo =
    String.startsWith "bot" pseudo
