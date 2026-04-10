module View.Rack exposing (viewRack)

{-| Player rack rendering: horizontal row of tiles that can be clicked to select.
-}

import Html exposing (Html)
import Html.Attributes
import Svg exposing (..)
import Svg.Attributes exposing (..)
import Svg.Events
import Types.Tile exposing (RackTile, TileFace)
import View.Tile exposing (viewTile)


{-| Render the player's rack as a compact horizontal SVG strip for the footer.
-}
viewRack :
    List RackTile
    -> List Int
    -> (Int -> msg)
    -> Html msg
viewRack tiles selectedIndices onTileClick =
    let
        tileCount =
            List.length tiles

        -- Each tile is 90 units in a 96-unit cell in the viewBox
        -- We render at native size and let CSS scale it down
        cellW =
            96

        svgWidth =
            Basics.max 200 (tileCount * cellW + 8)
    in
    svg
        [ viewBox ("0 0 " ++ String.fromInt svgWidth ++ " 100")
        , Html.Attributes.style "height" "60px"
        , Html.Attributes.style "width" (String.fromInt (tileCount * 64 + 8) ++ "px")
        , Html.Attributes.style "max-width" "100%"
        , Html.Attributes.style "flex-shrink" "1"
        ]
        (List.indexedMap
            (\idx rt ->
                let
                    isSelected =
                        List.member idx selectedIndices

                    xPos =
                        idx * cellW + 4
                in
                g
                    [ transform ("translate(" ++ String.fromInt xPos ++ ", 4)")
                    , Svg.Attributes.cursor "pointer"
                    , Svg.Events.onClick (onTileClick idx)
                    ]
                    [ if isSelected then
                        rect
                            [ x "-2"
                            , y "-2"
                            , width "94"
                            , height "94"
                            , rx "10"
                            , fill "none"
                            , stroke "#e2a03f"
                            , strokeWidth "4"
                            ]
                            []

                      else
                        text ""
                    , viewTile rt.face False False
                    ]
            )
            tiles
        )
