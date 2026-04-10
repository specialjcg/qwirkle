module Api.Auth exposing (AuthResponse, login, register, registerGuest)

import Http
import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Encode


type alias AuthResponse =
    { token : String
    , pseudo : String
    }


authResponseDecoder : Decoder AuthResponse
authResponseDecoder =
    Decode.map2 AuthResponse
        (Decode.field "token" Decode.string)
        (Decode.field "pseudo" Decode.string)


login : String -> { pseudo : String, password : String } -> (Result Http.Error AuthResponse -> msg) -> Cmd msg
login baseUrl creds toMsg =
    Http.post
        { url = baseUrl ++ "/api/auth/login"
        , body =
            Http.jsonBody
                (Encode.object
                    [ ( "pseudo", Encode.string creds.pseudo )
                    , ( "password", Encode.string creds.password )
                    ]
                )
        , expect = Http.expectJson toMsg authResponseDecoder
        }


register : String -> { pseudo : String, email : String, password : String } -> (Result Http.Error AuthResponse -> msg) -> Cmd msg
register baseUrl reg toMsg =
    Http.post
        { url = baseUrl ++ "/api/auth/register"
        , body =
            Http.jsonBody
                (Encode.object
                    [ ( "pseudo", Encode.string reg.pseudo )
                    , ( "email", Encode.string reg.email )
                    , ( "password", Encode.string reg.password )
                    ]
                )
        , expect = Http.expectJson toMsg authResponseDecoder
        }


registerGuest : String -> (Result Http.Error AuthResponse -> msg) -> Cmd msg
registerGuest baseUrl toMsg =
    Http.post
        { url = baseUrl ++ "/api/auth/guest"
        , body = Http.emptyBody
        , expect = Http.expectJson toMsg authResponseDecoder
        }
