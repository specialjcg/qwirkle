module View.Tile exposing (viewTile, viewTileAt)

{-| SVG programmatic tile rendering. Each shape is a pure SVG path
parameterized by color. No external image files needed.
-}

import Svg exposing (..)
import Svg.Attributes exposing (..)
import Types.Color exposing (Color(..), colorToCss)
import Types.Shape exposing (Shape(..))
import Types.Tile exposing (TileFace)


{-| Render a tile face as SVG centered at (0,0) within a 90x90 viewBox.
The tile is a rounded rect background with a shape inside.
-}
viewTile : TileFace -> Bool -> Bool -> Svg msg
viewTile face isLastPlayed isDragging =
    let
        fill =
            colorToCss face.color

        opacity_ =
            if isDragging then
                "0.6"

            else
                "1"

        glowFilter =
            if isLastPlayed then
                "url(#glow)"

            else
                ""
    in
    g [ Svg.Attributes.opacity opacity_ ]
        [ -- Background rounded rect
          rect
            [ x "2"
            , y "2"
            , width "86"
            , height "86"
            , rx "8"
            , ry "8"
            , Svg.Attributes.fill "#1e2a47"
            , stroke "#2a3550"
            , strokeWidth "1.5"
            , Svg.Attributes.filter glowFilter
            ]
            []

        -- Inner bevel highlight
        , rect
            [ x "5"
            , y "5"
            , width "80"
            , height "80"
            , rx "6"
            , ry "6"
            , Svg.Attributes.fill "#16213e"
            , stroke "#2a3550"
            , strokeWidth "0.5"
            ]
            []

        -- Shape
        , viewShape face.shape fill
        ]


{-| Render a tile at a specific board position (in tile units).
-}
viewTileAt : Int -> Int -> TileFace -> Bool -> Bool -> Svg msg
viewTileAt tileX tileY face isLastPlayed isDragging =
    g
        [ transform
            ("translate("
                ++ String.fromInt (tileX * 92)
                ++ ","
                ++ String.fromInt (tileY * 92)
                ++ ")"
            )
        ]
        [ viewTile face isLastPlayed isDragging ]


viewShape : Shape -> String -> Svg msg
viewShape shape fill =
    case shape of
        Circle ->
            circle
                [ cx "45"
                , cy "45"
                , r "28"
                , Svg.Attributes.fill fill
                , Svg.Attributes.filter "url(#bevel)"
                ]
                []

        Square ->
            rect
                [ x "17"
                , y "17"
                , width "56"
                , height "56"
                , rx "3"
                , Svg.Attributes.fill fill
                , Svg.Attributes.filter "url(#bevel)"
                ]
                []

        Diamond ->
            polygon
                [ points "45,12 78,45 45,78 12,45"
                , Svg.Attributes.fill fill
                , Svg.Attributes.filter "url(#bevel)"
                ]
                []

        Clover ->
            g []
                [ circle [ cx "45", cy "25", r "14", Svg.Attributes.fill fill ] []
                , circle [ cx "25", cy "50", r "14", Svg.Attributes.fill fill ] []
                , circle [ cx "65", cy "50", r "14", Svg.Attributes.fill fill ] []
                , circle [ cx "45", cy "60", r "14", Svg.Attributes.fill fill ] []
                , rect [ x "35", y "25", width "20", height "40", Svg.Attributes.fill fill ] []
                , rect [ x "25", y "40", width "40", height "20", Svg.Attributes.fill fill ] []
                ]

        FourPointStar ->
            polygon
                [ points "45,8 55,35 82,35 60,52 68,82 45,65 22,82 30,52 8,35 35,35"
                , Svg.Attributes.fill fill
                , Svg.Attributes.filter "url(#bevel)"
                ]
                []

        EightPointStar ->
            polygon
                [ points "45,6 53,28 70,12 60,33 84,28 65,43 88,45 65,50 84,62 60,57 70,78 53,62 45,84 37,62 20,78 30,57 6,62 25,50 2,45 25,43 6,28 30,33 20,12 37,28"
                , Svg.Attributes.fill fill
                , Svg.Attributes.filter "url(#bevel)"
                ]
                []
