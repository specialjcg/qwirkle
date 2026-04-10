module RouteTest exposing (..)

import Expect
import Route exposing (..)
import Test exposing (..)
import Url


suite : Test
suite =
    describe "Route"
        [ describe "fromUrl"
            [ test "parses /login" <|
                \_ ->
                    parseRoute "/login" |> Expect.equal Login
            , test "parses /register" <|
                \_ ->
                    parseRoute "/register" |> Expect.equal Register
            , test "parses /lobby" <|
                \_ ->
                    parseRoute "/lobby" |> Expect.equal Lobby
            , test "parses /opponents" <|
                \_ ->
                    parseRoute "/opponents" |> Expect.equal Opponents
            , test "parses /game/42" <|
                \_ ->
                    parseRoute "/game/42" |> Expect.equal (Game 42)
            , test "parses /waiting" <|
                \_ ->
                    parseRoute "/waiting" |> Expect.equal Waiting
            , test "parses root as Lobby" <|
                \_ ->
                    parseRoute "/" |> Expect.equal Lobby
            , test "parses unknown as NotFound" <|
                \_ ->
                    parseRoute "/unknown/path" |> Expect.equal NotFound
            ]
        , describe "toPath"
            [ test "Login -> /login" <|
                \_ ->
                    toPath Login |> Expect.equal "/login"
            , test "Game 7 -> /game/7" <|
                \_ ->
                    toPath (Game 7) |> Expect.equal "/game/7"
            , test "Lobby -> /lobby" <|
                \_ ->
                    toPath Lobby |> Expect.equal "/lobby"
            ]
        ]


parseRoute : String -> Route
parseRoute path =
    case
        Url.fromString ("http://localhost" ++ path)
    of
        Just url ->
            fromUrl url

        Nothing ->
            NotFound
