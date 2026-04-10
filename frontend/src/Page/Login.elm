module Page.Login exposing (Model, Msg(..), init, update, view)

import Api.Auth exposing (AuthResponse)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onInput)
import Http


type alias Model =
    { pseudo : String
    , password : String
    , error : Maybe String
    }


type Msg
    = SetPseudo String
    | SetPassword String
    | SubmitLogin
    | SubmitGuest
    | GotAuth (Result Http.Error AuthResponse)
    | GoToRegister


init : Model
init =
    { pseudo = ""
    , password = ""
    , error = Nothing
    }


update : String -> Msg -> Model -> ( Model, Cmd Msg )
update baseUrl msg model =
    case msg of
        SetPseudo s ->
            ( { model | pseudo = s }, Cmd.none )

        SetPassword s ->
            ( { model | password = s }, Cmd.none )

        SubmitLogin ->
            ( { model | error = Nothing }
            , Api.Auth.login baseUrl
                { pseudo = model.pseudo, password = model.password }
                GotAuth
            )

        SubmitGuest ->
            ( { model | error = Nothing }
            , Api.Auth.registerGuest baseUrl GotAuth
            )

        GotAuth _ ->
            -- Handled by Main
            ( model, Cmd.none )

        GoToRegister ->
            -- Handled by Main
            ( model, Cmd.none )


view : Model -> Html Msg
view model =
    div [ class "page login-page" ]
        [ div [ class "login-card" ]
            [ h1 [ class "logo" ] [ text "QWIRKLE" ]
            , p [ class "subtitle" ] [ text "Tile strategy game" ]
            , case model.error of
                Just err ->
                    div [ class "error-msg" ] [ text err ]

                Nothing ->
                    text ""
            , div [ class "form-group" ]
                [ input
                    [ type_ "text"
                    , placeholder "Pseudo"
                    , value model.pseudo
                    , onInput SetPseudo
                    , class "input-field"
                    ]
                    []
                ]
            , div [ class "form-group" ]
                [ input
                    [ type_ "password"
                    , placeholder "Password"
                    , value model.password
                    , onInput SetPassword
                    , class "input-field"
                    ]
                    []
                ]
            , button [ onClick SubmitLogin, class "btn btn-primary" ] [ text "Login" ]
            , button [ onClick SubmitGuest, class "btn btn-secondary" ] [ text "Play as Guest" ]
            , p [ class "link", onClick GoToRegister ] [ text "Create an account" ]
            ]
        ]
