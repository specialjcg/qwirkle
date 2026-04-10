module Main exposing (main)

import Api.Game
import Browser
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Http
import Page.Game as Game
import Page.Lobby as Lobby
import Page.Login as Login
import Page.Opponents as Opponents
import Page.Register as Register
import Page.Waiting as Waiting
import Port
import Route exposing (Route)
import Sse exposing (SseEvent(..), decodeSseEvent)
import Url exposing (Url)


main : Program Flags Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlChange = UrlChanged
        , onUrlRequest = UrlRequested
        }


type alias Flags =
    { token : Maybe String
    }


type alias Model =
    { key : Nav.Key
    , route : Route
    , page : Page
    , token : Maybe String
    , pseudo : String
    , baseUrl : String
    , pendingInstantPlayers : Int
    }


type Page
    = LoginPage Login.Model
    | RegisterPage Register.Model
    | LobbyPage Lobby.Model
    | OpponentsPage Opponents.Model
    | GamePage Game.Model
    | WaitingPage Waiting.Model


type Msg
    = UrlChanged Url
    | UrlRequested Browser.UrlRequest
    | LoginMsg Login.Msg
    | RegisterMsg Register.Msg
    | LobbyMsg Lobby.Msg
    | OpponentsMsg Opponents.Msg
    | GameMsg Game.Msg
    | WaitingMsg Waiting.Msg
    | GotCreateGame (Result Http.Error Api.Game.CreateGameResponse)
    | SseEvent String
    | NoOp


init : Flags -> Url -> Nav.Key -> ( Model, Cmd Msg )
init flags url key =
    let
        -- Same origin: frontend is served from the backend
        apiUrl =
            protocolToString url.protocol ++ "://" ++ url.host ++ portString url

        route =
            Route.fromUrl url

        model =
            { key = key
            , route = route
            , page = LoginPage Login.init
            , token = flags.token
            , pseudo = ""
            , baseUrl = apiUrl
            , pendingInstantPlayers = 2
            }
    in
    case flags.token of
        Just _ ->
            navigateTo model route

        Nothing ->
            case route of
                Route.Login ->
                    ( { model | page = LoginPage Login.init }, Cmd.none )

                Route.Register ->
                    ( { model | page = RegisterPage Register.init }, Cmd.none )

                _ ->
                    ( model, Nav.pushUrl key (Route.toPath Route.Login) )


protocolToString : Url.Protocol -> String
protocolToString protocol =
    case protocol of
        Url.Http ->
            "http"

        Url.Https ->
            "https"


portString : Url -> String
portString url =
    case url.port_ of
        Just p ->
            ":" ++ String.fromInt p

        Nothing ->
            ""


navigateTo : Model -> Route -> ( Model, Cmd Msg )
navigateTo model route =
    case route of
        Route.Login ->
            ( { model | route = route, page = LoginPage Login.init }, Cmd.none )

        Route.Register ->
            ( { model | route = route, page = RegisterPage Register.init }, Cmd.none )

        Route.Lobby ->
            case model.token of
                Just token ->
                    let
                        ( lobbyModel, lobbyCmd ) =
                            Lobby.init model.baseUrl token
                    in
                    ( { model | route = route, page = LobbyPage lobbyModel }
                    , Cmd.map LobbyMsg lobbyCmd
                    )

                Nothing ->
                    ( model, Nav.pushUrl model.key (Route.toPath Route.Login) )

        Route.Opponents ->
            case model.token of
                Just token ->
                    let
                        ( oppModel, oppCmd ) =
                            Opponents.init model.baseUrl token
                    in
                    ( { model | route = route, page = OpponentsPage oppModel }
                    , Cmd.map OpponentsMsg oppCmd
                    )

                Nothing ->
                    ( model, Nav.pushUrl model.key (Route.toPath Route.Login) )

        Route.Game gameId ->
            case model.token of
                Just token ->
                    let
                        ( gameModel, gameCmd ) =
                            Game.init model.baseUrl token model.pseudo gameId
                    in
                    ( { model | route = route, page = GamePage gameModel }
                    , Cmd.batch
                        [ Cmd.map GameMsg gameCmd
                        , Port.sseConnect (model.baseUrl ++ "/api/games/" ++ String.fromInt gameId ++ "/events")
                        ]
                    )

                Nothing ->
                    ( model, Nav.pushUrl model.key (Route.toPath Route.Login) )

        Route.Waiting ->
            case model.token of
                Just token ->
                    let
                        ( waitModel, waitCmd ) =
                            Waiting.init model.baseUrl token model.pendingInstantPlayers
                    in
                    ( { model | route = route, page = WaitingPage waitModel }
                    , Cmd.map WaitingMsg waitCmd
                    )

                Nothing ->
                    ( model, Nav.pushUrl model.key (Route.toPath Route.Login) )

        Route.NotFound ->
            ( model, Nav.pushUrl model.key (Route.toPath Route.Login) )


createGameCmd : Model -> List String -> Cmd Msg
createGameCmd model opponents =
    case model.token of
        Just token ->
            Api.Game.createGame model.baseUrl token opponents GotCreateGame

        Nothing ->
            Cmd.none


watchBotsCmd : Model -> List String -> Cmd Msg
watchBotsCmd model bots =
    case model.token of
        Just token ->
            Api.Game.createSpectateGame model.baseUrl token bots GotCreateGame

        Nothing ->
            Cmd.none


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model.page ) of
        ( UrlChanged url, _ ) ->
            navigateTo model (Route.fromUrl url)

        ( UrlRequested request, _ ) ->
            case request of
                Browser.Internal url ->
                    ( model, Nav.pushUrl model.key (Url.toString url) )

                Browser.External href ->
                    ( model, Nav.load href )

        -- Auth: Login
        ( LoginMsg loginMsg, LoginPage loginModel ) ->
            case loginMsg of
                Login.GotAuth (Ok auth) ->
                    ( { model | token = Just auth.token, pseudo = auth.pseudo }
                    , Cmd.batch
                        [ Port.storeToken auth.token
                        , Nav.pushUrl model.key (Route.toPath Route.Lobby)
                        ]
                    )

                Login.GotAuth (Err _) ->
                    ( { model | page = LoginPage { loginModel | error = Just "Login failed" } }, Cmd.none )

                Login.GoToRegister ->
                    ( model, Nav.pushUrl model.key (Route.toPath Route.Register) )

                _ ->
                    let
                        ( newLogin, loginCmd ) =
                            Login.update model.baseUrl loginMsg loginModel
                    in
                    ( { model | page = LoginPage newLogin }, Cmd.map LoginMsg loginCmd )

        -- Auth: Register
        ( RegisterMsg registerMsg, RegisterPage registerModel ) ->
            case registerMsg of
                Register.GotAuth (Ok auth) ->
                    ( { model | token = Just auth.token, pseudo = auth.pseudo }
                    , Cmd.batch
                        [ Port.storeToken auth.token
                        , Nav.pushUrl model.key (Route.toPath Route.Lobby)
                        ]
                    )

                Register.GotAuth (Err _) ->
                    ( { model | page = RegisterPage { registerModel | error = Just "Registration failed" } }, Cmd.none )

                Register.GoToLogin ->
                    ( model, Nav.pushUrl model.key (Route.toPath Route.Login) )

                _ ->
                    let
                        ( newReg, regCmd ) =
                            Register.update model.baseUrl registerMsg registerModel
                    in
                    ( { model | page = RegisterPage newReg }, Cmd.map RegisterMsg regCmd )

        -- Lobby
        ( LobbyMsg lobbyMsg, LobbyPage lobbyModel ) ->
            case lobbyMsg of
                Lobby.SelectGame gid ->
                    ( model, Nav.pushUrl model.key (Route.toPath (Route.Game gid)) )

                Lobby.GoToOpponents ->
                    ( model, Nav.pushUrl model.key (Route.toPath Route.Opponents) )

                Lobby.Logout ->
                    ( { model | token = Nothing, pseudo = "" }
                    , Cmd.batch
                        [ Port.storeToken ""
                        , Nav.pushUrl model.key (Route.toPath Route.Login)
                        ]
                    )

                Lobby.NewGameVsBot ->
                    ( model, createGameCmd model [ "bot1" ] )

                Lobby.NewGameVsMctsBot ->
                    ( model, createGameCmd model [ "bot2" ] )

                Lobby.WatchBotsBattle ->
                    ( model, watchBotsCmd model [ "bot1", "bot2" ] )

                Lobby.InstantGame n ->
                    ( { model | pendingInstantPlayers = n }
                    , Nav.pushUrl model.key (Route.toPath Route.Waiting)
                    )

                _ ->
                    let
                        ( newLobby, lobbyCmd ) =
                            Lobby.update lobbyMsg lobbyModel
                    in
                    ( { model | page = LobbyPage newLobby }, Cmd.map LobbyMsg lobbyCmd )

        -- Opponents
        ( OpponentsMsg opponentsMsg, OpponentsPage opponentsModel ) ->
            case opponentsMsg of
                Opponents.CreateGame ->
                    let
                        opponents =
                            [ opponentsModel.opponent1, opponentsModel.opponent2, opponentsModel.opponent3 ]
                                |> List.filter (\s -> s /= "")
                    in
                    ( model, createGameCmd model opponents )

                Opponents.GoBack ->
                    ( model, Nav.pushUrl model.key (Route.toPath Route.Lobby) )

                _ ->
                    let
                        ( newOpp, oppCmd ) =
                            Opponents.update opponentsMsg opponentsModel
                    in
                    ( { model | page = OpponentsPage newOpp }, Cmd.map OpponentsMsg oppCmd )

        -- Game creation response
        ( GotCreateGame (Ok resp), _ ) ->
            ( model, Nav.pushUrl model.key (Route.toPath (Route.Game resp.gameId)) )

        ( GotCreateGame (Err _), _ ) ->
            -- TODO: show error
            ( model, Cmd.none )

        -- Game
        ( GameMsg gameMsg, GamePage gameModel ) ->
            case gameMsg of
                Game.GoToLobby ->
                    ( model
                    , Cmd.batch
                        [ Port.sseDisconnect ()
                        , Nav.pushUrl model.key (Route.toPath Route.Lobby)
                        ]
                    )

                _ ->
                    let
                        ( newGame, gameCmd ) =
                            Game.update gameMsg gameModel
                    in
                    ( { model | page = GamePage newGame }, Cmd.map GameMsg gameCmd )

        -- Waiting
        ( WaitingMsg waitingMsg, WaitingPage waitingModel ) ->
            case waitingMsg of
                Waiting.GoBack ->
                    ( model, Nav.pushUrl model.key (Route.toPath Route.Lobby) )

                Waiting.GotInstantGame (Ok resp) ->
                    case resp.gameId of
                        Just gid ->
                            ( model, Nav.pushUrl model.key (Route.toPath (Route.Game gid)) )

                        Nothing ->
                            let
                                ( newWait, waitCmd ) =
                                    Waiting.update waitingMsg waitingModel
                            in
                            ( { model | page = WaitingPage newWait }, Cmd.map WaitingMsg waitCmd )

                _ ->
                    let
                        ( newWait, waitCmd ) =
                            Waiting.update waitingMsg waitingModel
                    in
                    ( { model | page = WaitingPage newWait }, Cmd.map WaitingMsg waitCmd )

        -- SSE event dispatch
        ( SseEvent rawJson, GamePage gameModel ) ->
            let
                event =
                    decodeSseEvent rawJson

                gameMsg =
                    case event of
                        TilesPlayed data ->
                            Game.SseTilesPlayed data

                        TilesSwapped data ->
                            Game.SseTilesSwapped data

                        TurnChanged data ->
                            Game.SseTurnChanged data

                        GameOver data ->
                            Game.SseGameOver data

                        _ ->
                            Game.RefreshGame

                ( newGame, gameCmd ) =
                    Game.update gameMsg gameModel
            in
            ( { model | page = GamePage newGame }, Cmd.map GameMsg gameCmd )

        ( SseEvent rawJson, WaitingPage waitingModel ) ->
            case decodeSseEvent rawJson of
                InstantGameStarted data ->
                    ( model, Nav.pushUrl model.key (Route.toPath (Route.Game data.gameId)) )

                _ ->
                    ( model, Cmd.none )

        _ ->
            ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Port.sseReceived SseEvent
        , case model.page of
            GamePage gameModel ->
                Sub.map GameMsg (Game.subscriptions gameModel)

            _ ->
                Sub.none
        ]


view : Model -> Browser.Document Msg
view model =
    { title = "Qwirkle"
    , body =
        [ div [ class "app" ]
            [ case model.page of
                LoginPage pageModel ->
                    Html.map LoginMsg (Login.view pageModel)

                RegisterPage pageModel ->
                    Html.map RegisterMsg (Register.view pageModel)

                LobbyPage pageModel ->
                    Html.map LobbyMsg (Lobby.view model.pseudo pageModel)

                OpponentsPage pageModel ->
                    Html.map OpponentsMsg (Opponents.view pageModel)

                GamePage pageModel ->
                    Html.map GameMsg (Game.view model.pseudo pageModel)

                WaitingPage pageModel ->
                    Html.map WaitingMsg (Waiting.view pageModel)
            ]
        ]
    }
