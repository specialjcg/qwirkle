module View.Scoreboard exposing (viewScoreboard)

{-| Player scoreboard display.
-}

import Html exposing (..)
import Html.Attributes exposing (..)
import Types.Player exposing (Player, displayName)


viewScoreboard : List Player -> String -> Html msg
viewScoreboard players currentPseudo =
    div [ class "scoreboard" ]
        (List.map (viewPlayerScore currentPseudo) players)


viewPlayerScore : String -> Player -> Html msg
viewPlayerScore currentPseudo player =
    div
        [ class
            ("player-score"
                ++ (if player.isTurn then
                        " active"

                    else
                        ""
                   )
                ++ (if player.pseudo == currentPseudo then
                        " is-me"

                    else
                        ""
                   )
            )
        ]
        [ div [ class "player-score-main" ]
            [ span [ class "player-name" ]
                [ text (displayName player.pseudo)
                , if player.pseudo == currentPseudo then
                    span [ class "me-badge" ] [ text "(you)" ]

                  else
                    text ""
                ]
            , span [ class "player-points" ] [ text (String.fromInt player.points) ]
            ]
        , if player.lastTurnPoints > 0 then
            span [ class "last-turn-points" ]
                [ text ("+" ++ String.fromInt player.lastTurnPoints) ]

          else
            text ""
        ]
