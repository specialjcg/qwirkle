module Api.Action exposing (PlayResult, SimulationResult, SwapResult, arrangRack, playTiles, simulatePlay, skipTurn, swapTiles)

import Api.Http exposing (authPost, authPostEmpty)
import Http
import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Encode
import Types.Tile exposing (BoardTile, Coordinate, RackTile, TileFace, coordinateEncoder, rackTileDecoder, tileFaceEncoder)


type alias PlayResult =
    { code : String
    , points : Int
    , newRack : List RackTile
    }


type alias SimulationResult =
    { code : String
    , points : Int
    }


type alias SwapResult =
    { newRack : List RackTile
    }


playResultDecoder : Decoder PlayResult
playResultDecoder =
    Decode.map3 PlayResult
        (Decode.field "code" Decode.string)
        (Decode.field "points" Decode.int)
        (Decode.field "new_rack" (Decode.list rackTileDecoder))


simulationResultDecoder : Decoder SimulationResult
simulationResultDecoder =
    Decode.map2 SimulationResult
        (Decode.field "code" Decode.string)
        (Decode.field "points" Decode.int)


swapResultDecoder : Decoder SwapResult
swapResultDecoder =
    Decode.map SwapResult
        (Decode.field "new_rack" (Decode.list rackTileDecoder))


encodePlacement : { face : TileFace, coordinate : Coordinate } -> Encode.Value
encodePlacement p =
    Encode.object
        [ ( "tile", tileFaceEncoder p.face )
        , ( "coordinate", coordinateEncoder p.coordinate )
        ]


playTiles : String -> String -> Int -> List { face : TileFace, coordinate : Coordinate } -> (Result Http.Error PlayResult -> msg) -> Cmd msg
playTiles baseUrl token gameId placements toMsg =
    authPost baseUrl token
        ("/api/games/" ++ String.fromInt gameId ++ "/play")
        (Encode.list encodePlacement placements)
        playResultDecoder
        toMsg


simulatePlay : String -> String -> Int -> List { face : TileFace, coordinate : Coordinate } -> (Result Http.Error SimulationResult -> msg) -> Cmd msg
simulatePlay baseUrl token gameId placements toMsg =
    authPost baseUrl token
        ("/api/games/" ++ String.fromInt gameId ++ "/simulate")
        (Encode.list encodePlacement placements)
        simulationResultDecoder
        toMsg


swapTiles : String -> String -> Int -> List TileFace -> (Result Http.Error SwapResult -> msg) -> Cmd msg
swapTiles baseUrl token gameId faces toMsg =
    authPost baseUrl token
        ("/api/games/" ++ String.fromInt gameId ++ "/swap")
        (Encode.object [ ( "tiles", Encode.list tileFaceEncoder faces ) ])
        swapResultDecoder
        toMsg


skipTurn : String -> String -> Int -> (Result Http.Error () -> msg) -> Cmd msg
skipTurn baseUrl token gameId toMsg =
    authPostEmpty baseUrl token ("/api/games/" ++ String.fromInt gameId ++ "/skip") toMsg


arrangRack : String -> String -> Int -> List RackTile -> (Result Http.Error (List RackTile) -> msg) -> Cmd msg
arrangRack baseUrl token gameId tiles toMsg =
    let
        encodeRackTile rt =
            Encode.object
                [ ( "tile", tileFaceEncoder rt.face )
                , ( "rack_position", Encode.int rt.rackPosition )
                ]
    in
    authPost baseUrl token
        ("/api/games/" ++ String.fromInt gameId ++ "/arrange-rack")
        (Encode.object [ ( "tiles", Encode.list encodeRackTile tiles ) ])
        (Decode.list rackTileDecoder)
        toMsg
