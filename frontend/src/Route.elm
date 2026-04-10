module Route exposing (Route(..), fromUrl, toPath)

import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), Parser)


type Route
    = Login
    | Register
    | Lobby
    | Opponents
    | Game Int
    | Waiting
    | NotFound


parser : Parser (Route -> a) a
parser =
    Parser.oneOf
        [ Parser.map Login (Parser.s "login")
        , Parser.map Register (Parser.s "register")
        , Parser.map Lobby (Parser.s "lobby")
        , Parser.map Opponents (Parser.s "opponents")
        , Parser.map Game (Parser.s "game" </> Parser.int)
        , Parser.map Waiting (Parser.s "waiting")
        , Parser.map Lobby Parser.top
        ]


fromUrl : Url -> Route
fromUrl url =
    Parser.parse parser url
        |> Maybe.withDefault NotFound


toPath : Route -> String
toPath route =
    case route of
        Login ->
            "/login"

        Register ->
            "/register"

        Lobby ->
            "/lobby"

        Opponents ->
            "/opponents"

        Game id ->
            "/game/" ++ String.fromInt id

        Waiting ->
            "/waiting"

        NotFound ->
            "/login"
