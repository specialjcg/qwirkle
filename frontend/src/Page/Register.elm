module Page.Register exposing (Model, Msg(..), init, update, view)

import Api.Auth exposing (AuthResponse)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onInput)
import Http


type alias Model =
    { pseudo : String
    , email : String
    , password : String
    , error : Maybe String
    }


type Msg
    = SetPseudo String
    | SetEmail String
    | SetPassword String
    | SubmitRegister
    | GotAuth (Result Http.Error AuthResponse)
    | GoToLogin


init : Model
init =
    { pseudo = ""
    , email = ""
    , password = ""
    , error = Nothing
    }


update : String -> Msg -> Model -> ( Model, Cmd Msg )
update baseUrl msg model =
    case msg of
        SetPseudo s ->
            ( { model | pseudo = s }, Cmd.none )

        SetEmail s ->
            ( { model | email = s }, Cmd.none )

        SetPassword s ->
            ( { model | password = s }, Cmd.none )

        SubmitRegister ->
            ( { model | error = Nothing }
            , Api.Auth.register baseUrl
                { pseudo = model.pseudo, email = model.email, password = model.password }
                GotAuth
            )

        GotAuth _ ->
            ( model, Cmd.none )

        GoToLogin ->
            ( model, Cmd.none )


view : Model -> Html Msg
view model =
    div [ class "page register-page" ]
        [ div [ class "login-card" ]
            [ h1 [ class "logo" ] [ text "QWIRKLE" ]
            , h2 [] [ text "Create Account" ]
            , case model.error of
                Just err ->
                    div [ class "error-msg" ] [ text err ]

                Nothing ->
                    text ""
            , div [ class "form-group" ]
                [ input [ type_ "text", placeholder "Pseudo", value model.pseudo, onInput SetPseudo, class "input-field" ] [] ]
            , div [ class "form-group" ]
                [ input [ type_ "email", placeholder "Email", value model.email, onInput SetEmail, class "input-field" ] [] ]
            , div [ class "form-group" ]
                [ input [ type_ "password", placeholder "Password", value model.password, onInput SetPassword, class "input-field" ] [] ]
            , button [ onClick SubmitRegister, class "btn btn-primary" ] [ text "Register" ]
            , p [ class "link", onClick GoToLogin ] [ text "Already have an account?" ]
            ]
        ]
