module View.Board exposing (Viewport, defaultViewport, viewBoard)

{-| SVG board rendering with pan/zoom via viewBox manipulation.
The board is an infinite grid; we fit-to-screen by computing the viewBox
from tile bounds with padding.
-}

import Html exposing (Html)
import Html.Attributes
import Set exposing (Set)
import Svg exposing (..)
import Svg.Attributes exposing (..)
import Svg.Events
import Types.Tile exposing (BoardTile, Coordinate, TileFace)
import View.Tile exposing (viewTileAt)


type alias Viewport =
    { offsetX : Float
    , offsetY : Float
    , scale : Float
    }


defaultViewport : Viewport
defaultViewport =
    { offsetX = 0, offsetY = 0, scale = 1.0 }


type alias Bounds =
    { minX : Int, minY : Int, maxX : Int, maxY : Int }


{-| Size of one tile cell in SVG units.
-}
cellSize : Int
cellSize =
    92


{-| Render the game board as an SVG with viewBox-based pan/zoom.
The viewBox is computed to fit all tiles, then adjusted by pan offset and zoom scale.
-}
viewBoard :
    Viewport
    -> List BoardTile
    -> List BoardTile
    -> Set ( Int, Int )
    -> (Coordinate -> msg)
    -> (Coordinate -> msg)
    -> Html msg
viewBoard viewport boardTiles pendingTiles lastPlayedSet onCellClick onPendingClick =
    let
        allTiles =
            boardTiles ++ pendingTiles

        bounds =
            boardBounds allTiles

        -- Padding of 2 cells around content for drop targets
        pad =
            2

        contentMinX =
            toFloat ((bounds.minX - pad) * cellSize)

        contentMinY =
            toFloat ((bounds.minY - pad) * cellSize)

        contentW =
            toFloat ((bounds.maxX - bounds.minX + 1 + pad * 2) * cellSize)

        contentH =
            toFloat ((bounds.maxY - bounds.minY + 1 + pad * 2) * cellSize)

        -- Apply zoom: smaller scale = zoomed out (see more), larger = zoomed in
        vbW =
            contentW / viewport.scale

        vbH =
            contentH / viewport.scale

        -- Center the content, then apply pan offset
        vbX =
            contentMinX + (contentW - vbW) / 2 - viewport.offsetX

        vbY =
            contentMinY + (contentH - vbH) / 2 - viewport.offsetY

        viewBoxStr =
            String.fromFloat vbX
                ++ " "
                ++ String.fromFloat vbY
                ++ " "
                ++ String.fromFloat vbW
                ++ " "
                ++ String.fromFloat vbH

        occupiedSet =
            allTiles
                |> List.map (\t -> ( t.coordinate.x, t.coordinate.y ))
                |> Set.fromList

        -- Range for rendering grid and drop targets
        rangeMinX =
            bounds.minX - pad

        rangeMaxX =
            bounds.maxX + pad

        rangeMinY =
            bounds.minY - pad

        rangeMaxY =
            bounds.maxY + pad
    in
    svg
        [ viewBox viewBoxStr
        , Html.Attributes.style "width" "100%"
        , Html.Attributes.style "height" "100%"
        , Html.Attributes.style "display" "block"
        , preserveAspectRatio "xMidYMid meet"
        ]
        [ defs []
            [ Svg.filter [ id "bevel" ]
                [ feDropShadow
                    [ Svg.Attributes.dx "1"
                    , Svg.Attributes.dy "1"
                    , stdDeviation "1"
                    , floodColor "#000"
                    , floodOpacity "0.4"
                    ]
                    []
                ]
            , Svg.filter [ id "glow" ]
                [ feDropShadow
                    [ Svg.Attributes.dx "0"
                    , Svg.Attributes.dy "0"
                    , stdDeviation "4"
                    , floodColor "#e2a03f"
                    , floodOpacity "0.8"
                    ]
                    []
                ]
            ]

        -- Empty cell click targets (adjacent to occupied tiles)
        , g [ class "empty-cells" ]
            (List.concatMap
                (\gx ->
                    List.filterMap
                        (\gy ->
                            if not (Set.member ( gx, gy ) occupiedSet) && isAdjacentToOccupied gx gy occupiedSet then
                                Just
                                    (rect
                                        [ x (String.fromInt (gx * cellSize + 2))
                                        , y (String.fromInt (gy * cellSize + 2))
                                        , width "86"
                                        , height "86"
                                        , rx "8"
                                        , fill "rgba(226,160,63,0.05)"
                                        , stroke "rgba(226,160,63,0.3)"
                                        , strokeWidth "1.5"
                                        , strokeDasharray "6,4"
                                        , class "drop-target"
                                        , Svg.Attributes.cursor "pointer"
                                        , Svg.Events.onClick (onCellClick { x = gx, y = gy })
                                        ]
                                        []
                                    )

                            else
                                Nothing
                        )
                        (List.range rangeMinY rangeMaxY)
                )
                (List.range rangeMinX rangeMaxX)
            )

        -- Board tiles
        , g [ class "board-tiles" ]
            (List.map
                (\bt ->
                    viewTileAt bt.coordinate.x
                        bt.coordinate.y
                        bt.face
                        (Set.member ( bt.coordinate.x, bt.coordinate.y ) lastPlayedSet)
                        False
                )
                boardTiles
            )

        -- Pending placement tiles (clickable to remove)
        , g [ class "pending-tiles" ]
            (List.map
                (\bt ->
                    g
                        [ Svg.Attributes.cursor "pointer"
                        , Svg.Events.onClick (onPendingClick bt.coordinate)
                        ]
                        [ viewTileAt bt.coordinate.x
                            bt.coordinate.y
                            bt.face
                            False
                            True
                        ]
                )
                pendingTiles
            )
        ]


feDropShadow : List (Attribute msg) -> List (Svg msg) -> Svg msg
feDropShadow =
    Svg.node "feDropShadow"


boardBounds : List BoardTile -> Bounds
boardBounds tiles =
    case tiles of
        [] ->
            { minX = -2, minY = -2, maxX = 2, maxY = 2 }

        first :: rest ->
            List.foldl
                (\t b ->
                    { minX = Basics.min b.minX t.coordinate.x
                    , minY = Basics.min b.minY t.coordinate.y
                    , maxX = Basics.max b.maxX t.coordinate.x
                    , maxY = Basics.max b.maxY t.coordinate.y
                    }
                )
                { minX = first.coordinate.x
                , minY = first.coordinate.y
                , maxX = first.coordinate.x
                , maxY = first.coordinate.y
                }
                rest


isAdjacentToOccupied : Int -> Int -> Set ( Int, Int ) -> Bool
isAdjacentToOccupied gx gy occupied =
    if Set.isEmpty occupied then
        -- Empty board: only origin is valid
        gx == 0 && gy == 0

    else
        Set.member ( gx + 1, gy ) occupied
            || Set.member ( gx - 1, gy ) occupied
            || Set.member ( gx, gy + 1 ) occupied
            || Set.member ( gx, gy - 1 ) occupied
