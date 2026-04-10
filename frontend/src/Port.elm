port module Port exposing
    ( getStoredToken
    , onBoardCellClicked
    , onPendingTileClicked
    , onRackTileClicked
    , sendSceneState
    , set3DViewEnabled
    , sseConnect
    , sseDisconnect
    , sseReceived
    , storeToken
    )

{-| Ports for JavaScript interop: SSE, localStorage, and 3D scene.
-}

import Json.Decode as Decode
import Json.Encode as Encode


-- SSE


port sseConnect : String -> Cmd msg


port sseDisconnect : () -> Cmd msg


port sseReceived : (String -> msg) -> Sub msg



-- Token storage


port storeToken : String -> Cmd msg


port getStoredToken : (Maybe String -> msg) -> Sub msg



-- 3D Scene (outbound: Elm → JS)


port sendSceneState : Encode.Value -> Cmd msg


port set3DViewEnabled : Bool -> Cmd msg



-- 3D Scene (inbound: JS → Elm)


port onBoardCellClicked : (Decode.Value -> msg) -> Sub msg


port onRackTileClicked : (Int -> msg) -> Sub msg


port onPendingTileClicked : (Decode.Value -> msg) -> Sub msg
