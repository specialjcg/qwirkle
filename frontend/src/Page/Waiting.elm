module Page.Waiting exposing (Model, Msg(..), init, update, view)

import Api.InstantGame exposing (InstantGameResponse)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Http


type alias Model =
    { waitingPlayers : List String
    , playersNumber : Int
    , gameId : Maybe Int
    }


type Msg
    = GotInstantGame (Result Http.Error InstantGameResponse)
    | GameStarted Int
    | GoBack


init : String -> String -> Int -> ( Model, Cmd Msg )
init baseUrl token playersNumber =
    ( { waitingPlayers = []
      , playersNumber = playersNumber
      , gameId = Nothing
      }
    , Api.InstantGame.join baseUrl token playersNumber GotInstantGame
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotInstantGame (Ok resp) ->
            case resp.gameId of
                Just gid ->
                    ( { model | gameId = Just gid }, Cmd.none )

                Nothing ->
                    ( model, Cmd.none )

        GotInstantGame (Err _) ->
            ( model, Cmd.none )

        GameStarted _ ->
            ( model, Cmd.none )

        GoBack ->
            ( model, Cmd.none )


view : Model -> Html Msg
view model =
    div [ class "page waiting-page" ]
        [ div [ class "login-card" ]
            [ h1 [] [ text "Finding players..." ]
            , p [ class "waiting-info" ]
                [ text ("Looking for a " ++ String.fromInt model.playersNumber ++ "-player game") ]
            , div [ class "spinner" ] []
            , if not (List.isEmpty model.waitingPlayers) then
                div [ class "waiting-players" ]
                    [ h3 [] [ text "Players waiting" ]
                    , ul []
                        (List.map (\name -> li [ class "waiting-player" ] [ text name ]) model.waitingPlayers)
                    ]

              else
                text ""
            , button [ onClick GoBack, class "btn btn-secondary" ] [ text "Cancel" ]
            ]
        ]
