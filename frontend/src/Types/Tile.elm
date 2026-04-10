module Types.Tile exposing
    ( BoardTile
    , Coordinate
    , RackTile
    , TileFace
    , boardTileDecoder
    , coordinateDecoder
    , coordinateEncoder
    , rackTileDecoder
    , tileFaceDecoder
    , tileFaceEncoder
    )

import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Encode
import Types.Color exposing (Color, colorDecoder, colorEncoder)
import Types.Shape exposing (Shape, shapeDecoder, shapeEncoder)


type alias TileFace =
    { color : Color
    , shape : Shape
    }


type alias Coordinate =
    { x : Int
    , y : Int
    }


type alias BoardTile =
    { face : TileFace
    , coordinate : Coordinate
    }


type alias RackTile =
    { face : TileFace
    , rackPosition : Int
    }


tileFaceDecoder : Decoder TileFace
tileFaceDecoder =
    Decode.map2 TileFace
        (Decode.field "color" colorDecoder)
        (Decode.field "shape" shapeDecoder)


tileFaceEncoder : TileFace -> Encode.Value
tileFaceEncoder face =
    Encode.object
        [ ( "color", colorEncoder face.color )
        , ( "shape", shapeEncoder face.shape )
        ]


coordinateDecoder : Decoder Coordinate
coordinateDecoder =
    Decode.map2 Coordinate
        (Decode.field "x" Decode.int)
        (Decode.field "y" Decode.int)


coordinateEncoder : Coordinate -> Encode.Value
coordinateEncoder coord =
    Encode.object
        [ ( "x", Encode.int coord.x )
        , ( "y", Encode.int coord.y )
        ]


boardTileDecoder : Decoder BoardTile
boardTileDecoder =
    Decode.map2 BoardTile
        (Decode.field "face" tileFaceDecoder)
        (Decode.field "coordinate" coordinateDecoder)


rackTileDecoder : Decoder RackTile
rackTileDecoder =
    Decode.map2 RackTile
        (Decode.field "face" tileFaceDecoder)
        (Decode.field "rack_position" Decode.int)
