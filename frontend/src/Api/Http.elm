module Api.Http exposing (authDelete, authGet, authPost, authPostEmpty)

{-| Authenticated HTTP helpers that inject the Bearer token.
-}

import Http
import Json.Decode exposing (Decoder)
import Json.Encode as Encode


authGet : String -> String -> String -> Decoder a -> (Result Http.Error a -> msg) -> Cmd msg
authGet baseUrl token path decoder toMsg =
    Http.request
        { method = "GET"
        , headers = [ Http.header "Authorization" ("Bearer " ++ token) ]
        , url = baseUrl ++ path
        , body = Http.emptyBody
        , expect = Http.expectJson toMsg decoder
        , timeout = Nothing
        , tracker = Nothing
        }


authPost : String -> String -> String -> Encode.Value -> Decoder a -> (Result Http.Error a -> msg) -> Cmd msg
authPost baseUrl token path body decoder toMsg =
    Http.request
        { method = "POST"
        , headers = [ Http.header "Authorization" ("Bearer " ++ token) ]
        , url = baseUrl ++ path
        , body = Http.jsonBody body
        , expect = Http.expectJson toMsg decoder
        , timeout = Nothing
        , tracker = Nothing
        }


authPostEmpty : String -> String -> String -> (Result Http.Error () -> msg) -> Cmd msg
authPostEmpty baseUrl token path toMsg =
    Http.request
        { method = "POST"
        , headers = [ Http.header "Authorization" ("Bearer " ++ token) ]
        , url = baseUrl ++ path
        , body = Http.emptyBody
        , expect = Http.expectWhatever toMsg
        , timeout = Nothing
        , tracker = Nothing
        }


authDelete : String -> String -> String -> (Result Http.Error () -> msg) -> Cmd msg
authDelete baseUrl token path toMsg =
    Http.request
        { method = "DELETE"
        , headers = [ Http.header "Authorization" ("Bearer " ++ token) ]
        , url = baseUrl ++ path
        , body = Http.emptyBody
        , expect = Http.expectWhatever toMsg
        , timeout = Nothing
        , tracker = Nothing
        }
