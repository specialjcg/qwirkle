module Api.UserPrefs exposing (addBookmarked, fetchBookmarked)

import Api.Http exposing (authGet, authPostEmpty)
import Http
import Json.Decode as Decode


fetchBookmarked : String -> String -> (Result Http.Error (List String) -> msg) -> Cmd msg
fetchBookmarked baseUrl token toMsg =
    authGet baseUrl token "/api/user/bookmarked-opponents" (Decode.list Decode.string) toMsg


addBookmarked : String -> String -> String -> (Result Http.Error () -> msg) -> Cmd msg
addBookmarked baseUrl token name toMsg =
    authPostEmpty baseUrl token ("/api/user/bookmarked-opponents/" ++ name) toMsg
