import {
    fromBag,
    fromBoard,
    Player,
    RestBoard,
    RestRack,
    toBoard,
    toChangeRack,
    toPlayers,
    toWebPlayer
} from './player';
import { Tile } from './Tile';

describe('player', () => {
    it('should return player id', () => {
        const player: Player = {
            id: 0,
            pseudo: '',
            userId: 0,
            gameId: 0,
            gamePosition: 0,
            points: 0,
            lastTurnPoints: 0,
            rack: { tiles: [] },

            isTurn: true
        };
        expect(toWebPlayer(player)).toEqual(0);
    });
    it('should return  id 0 if no player ', () => {
        const player: Player = {
            id: 1,
            pseudo: '',
            userId: 0,
            gameId: 0,
            gamePosition: 0,
            points: 0,
            lastTurnPoints: 0,
            rack: { tiles: [] },
            isTurn: true
        };
        expect(toWebPlayer(player)).toEqual(1);
    });
    it('should return players with restboard ', () => {
        const restboard: RestBoard = {
            board: {
                tiles: [
                    {
                        coordinates: {
                            x: 3,
                            y: -1
                        },
                        id: 2,
                        color: 1,
                        shape: 2
                    },
                    {
                        coordinates: {
                            x: 4,
                            y: -1
                        },
                        id: 5,
                        color: 1,
                        shape: 5
                    },
                    {
                        coordinates: {
                            x: 7,
                            y: 3
                        },
                        id: 16,
                        color: 3,
                        shape: 4
                    },
                    {
                        coordinates: {
                            x: 2,
                            y: 0
                        },
                        id: 19,
                        color: 4,
                        shape: 1
                    },
                    {
                        coordinates: {
                            x: 1,
                            y: 0
                        },
                        id: 21,
                        color: 4,
                        shape: 3
                    },
                    {
                        coordinates: {
                            x: 3,
                            y: 2
                        },
                        id: 30,
                        color: 5,
                        shape: 6
                    },
                    {
                        coordinates: {
                            x: 2,
                            y: 1
                        },
                        id: 31,
                        color: 6,
                        shape: 1
                    },
                    {
                        coordinates: {
                            x: 2,
                            y: -1
                        },
                        id: 37,
                        color: 1,
                        shape: 1
                    },
                    {
                        coordinates: {
                            x: 6,
                            y: 3
                        },
                        id: 49,
                        color: 3,
                        shape: 1
                    },
                    {
                        coordinates: {
                            x: -1,
                            y: 0
                        },
                        id: 56,
                        color: 4,
                        shape: 2
                    },
                    {
                        coordinates: {
                            x: 0,
                            y: 0
                        },
                        id: 58,
                        color: 4,
                        shape: 4
                    },
                    {
                        coordinates: {
                            x: -2,
                            y: 0
                        },
                        id: 60,
                        color: 4,
                        shape: 6
                    },
                    {
                        coordinates: {
                            x: 4,
                            y: 2
                        },
                        id: 63,
                        color: 5,
                        shape: 3
                    },
                    {
                        coordinates: {
                            x: 1,
                            y: 2
                        },
                        id: 65,
                        color: 5,
                        shape: 5
                    },
                    {
                        coordinates: {
                            x: 5,
                            y: 3
                        },
                        id: 86,
                        color: 3,
                        shape: 2
                    },
                    {
                        coordinates: {
                            x: 4,
                            y: 3
                        },
                        id: 87,
                        color: 3,
                        shape: 3
                    },
                    {
                        coordinates: {
                            x: 8,
                            y: 3
                        },
                        id: 89,
                        color: 3,
                        shape: 5
                    },
                    {
                        coordinates: {
                            x: 2,
                            y: 2
                        },
                        id: 97,
                        color: 5,
                        shape: 1
                    }
                ]
            },
            players: [
                {
                    id: 3,
                    pseudo: 'Thomas',
                    userId:3,
                    gameId: 2,
                    gamePosition: 2,
                    points: 22,
                    lastTurnPoints: 5,
                    rack: {
                        tiles: [
                            {
                                rackPosition: 0,
                                id: 1,
                                color: 1,
                                shape: 1
                            },
                            {
                                rackPosition: 0,
                                id: 33,
                                color: 6,
                                shape: 3
                            },
                            {
                                rackPosition: 0,
                                id: 61,
                                color: 5,
                                shape: 1
                            },
                            {
                                rackPosition: 2,
                                id: 66,
                                color: 5,
                                shape: 6
                            },
                            {
                                rackPosition: 5,
                                id: 82,
                                color: 2,
                                shape: 4
                            },
                            {
                                rackPosition: 0,
                                id: 92,
                                color: 4,
                                shape: 2
                            }
                        ]
                    },
                    isTurn: false
                },
                {
                    id: 4,
                    pseudo: 'Jean charles',
                    userId:3,
                    gameId: 2,
                    gamePosition: 1,
                    points: 19,
                    lastTurnPoints: 6,
                    rack: {
                        tiles: [
                            {
                                rackPosition: 1,
                                id: 41,
                                color: 1,
                                shape: 5
                            },
                            {
                                rackPosition: 0,
                                id: 45,
                                color: 2,
                                shape: 3
                            },
                            {
                                rackPosition: 0,
                                id: 67,
                                color: 6,
                                shape: 1
                            },
                            {
                                rackPosition: 2,
                                id: 91,
                                color: 4,
                                shape: 1
                            },
                            {
                                rackPosition: 1,
                                id: 94,
                                color: 4,
                                shape: 4
                            },
                            {
                                rackPosition: 3,
                                id: 103,
                                color: 6,
                                shape: 1
                            }
                        ]
                    },
                    isTurn: true
                }
            ]
        };
        expect(toPlayers(restboard)).toEqual([
          {
            "gameId": 2,
            "gamePosition": 2,
            "id": 3,
            "isTurn": false,
            "lastTurnPoints": 5,
            "points": 22,
            "pseudo": "Thomas",
            "rack": {
              "tiles": [
                {
                  "color": 1,
                  "id": 1,
                  "rackPosition": 0,
                  "shape": 1
                },
                {
                  "color": 6,
                  "id": 33,
                  "rackPosition": 0,
                  "shape": 3
                },
                {
                  "color": 5,
                  "id": 61,
                  "rackPosition": 0,
                  "shape": 1
                },
                {
                  "color": 5,
                  "id": 66,
                  "rackPosition": 2,
                  "shape": 6
                },
                {
                  "color": 2,
                  "id": 82,
                  "rackPosition": 5,
                  "shape": 4
                },
                {
                  "color": 4,
                  "id": 92,
                  "rackPosition": 0,
                  "shape": 2
                }
              ]
            },
            "userId": 3
          },
          {
            "gameId": 2,
            "gamePosition": 1,
            "id": 4,
            "isTurn": true,
            "lastTurnPoints": 6,
            "points": 19,
            "pseudo": "Jean charles",
            "rack": {
              "tiles": [
                {
                  "color": 1,
                  "id": 41,
                  "rackPosition": 1,
                  "shape": 5
                },
                {
                  "color": 2,
                  "id": 45,
                  "rackPosition": 0,
                  "shape": 3
                },
                {
                  "color": 6,
                  "id": 67,
                  "rackPosition": 0,
                  "shape": 1
                },
                {
                  "color": 4,
                  "id": 91,
                  "rackPosition": 2,
                  "shape": 1
                },
                {
                  "color": 4,
                  "id": 94,
                  "rackPosition": 1,
                  "shape": 4
                },
                {
                  "color": 6,
                  "id": 103,
                  "rackPosition": 3,
                  "shape": 1
                }
              ]
            },
            "userId": 3
          }
        ]);
    });
    it("should return Boargame with mock restboard'", () => {
        const restboard: RestBoard = {
            board: {
                tiles: [
                    {
                        coordinates: {
                            x: 3,
                            y: -1
                        },
                        id: 2,
                        color: 1,
                        shape: 2
                    },
                    {
                        coordinates: {
                            x: 4,
                            y: -1
                        },
                        id: 5,
                        color: 1,
                        shape: 5
                    },
                    {
                        coordinates: {
                            x: 7,
                            y: 3
                        },
                        id: 16,
                        color: 3,
                        shape: 4
                    },
                    {
                        coordinates: {
                            x: 2,
                            y: 0
                        },
                        id: 19,
                        color: 4,
                        shape: 1
                    },
                    {
                        coordinates: {
                            x: 1,
                            y: 0
                        },
                        id: 21,
                        color: 4,
                        shape: 3
                    },
                    {
                        coordinates: {
                            x: 3,
                            y: 2
                        },
                        id: 30,
                        color: 5,
                        shape: 6
                    },
                    {
                        coordinates: {
                            x: 2,
                            y: 1
                        },
                        id: 31,
                        color: 6,
                        shape: 1
                    },
                    {
                        coordinates: {
                            x: 2,
                            y: -1
                        },
                        id: 37,
                        color: 1,
                        shape: 1
                    },
                    {
                        coordinates: {
                            x: 6,
                            y: 3
                        },
                        id: 49,
                        color: 3,
                        shape: 1
                    },
                    {
                        coordinates: {
                            x: -1,
                            y: 0
                        },
                        id: 56,
                        color: 4,
                        shape: 2
                    },
                    {
                        coordinates: {
                            x: 0,
                            y: 0
                        },
                        id: 58,
                        color: 4,
                        shape: 4
                    },
                    {
                        coordinates: {
                            x: -2,
                            y: 0
                        },
                        id: 60,
                        color: 4,
                        shape: 6
                    },
                    {
                        coordinates: {
                            x: 4,
                            y: 2
                        },
                        id: 63,
                        color: 5,
                        shape: 3
                    },
                    {
                        coordinates: {
                            x: 1,
                            y: 2
                        },
                        id: 65,
                        color: 5,
                        shape: 5
                    },
                    {
                        coordinates: {
                            x: 5,
                            y: 3
                        },
                        id: 86,
                        color: 3,
                        shape: 2
                    },
                    {
                        coordinates: {
                            x: 4,
                            y: 3
                        },
                        id: 87,
                        color: 3,
                        shape: 3
                    },
                    {
                        coordinates: {
                            x: 8,
                            y: 3
                        },
                        id: 89,
                        color: 3,
                        shape: 5
                    },
                    {
                        coordinates: {
                            x: 2,
                            y: 2
                        },
                        id: 97,
                        color: 5,
                        shape: 1
                    }
                ]
            },
            players: [
                {
                    id: 3,
                    pseudo: 'Thomas',
                  userId:3,
                    gameId: 2,
                    gamePosition: 2,
                    points: 22,
                    lastTurnPoints: 5,
                    rack: {
                        tiles: [
                            {
                                rackPosition: 0,
                                id: 1,
                                color: 1,
                                shape: 1
                            },
                            {
                                rackPosition: 0,
                                id: 33,
                                color: 6,
                                shape: 3
                            },
                            {
                                rackPosition: 0,
                                id: 61,
                                color: 5,
                                shape: 1
                            },
                            {
                                rackPosition: 2,
                                id: 66,
                                color: 5,
                                shape: 6
                            },
                            {
                                rackPosition: 5,
                                id: 82,
                                color: 2,
                                shape: 4
                            },
                            {
                                rackPosition: 0,
                                id: 92,
                                color: 4,
                                shape: 2
                            }
                        ]
                    },
                    isTurn: false
                },
                {
                    id: 4,
                    pseudo: 'Jean charles',
                  userId:3,
                    gameId: 2,
                    gamePosition: 1,
                    points: 19,
                    lastTurnPoints: 6,
                    rack: {
                        tiles: [
                            {
                                rackPosition: 1,
                                id: 41,
                                color: 1,
                                shape: 5
                            },
                            {
                                rackPosition: 0,
                                id: 45,
                                color: 2,
                                shape: 3
                            },
                            {
                                rackPosition: 0,
                                id: 67,
                                color: 6,
                                shape: 1
                            },
                            {
                                rackPosition: 2,
                                id: 91,
                                color: 4,
                                shape: 1
                            },
                            {
                                rackPosition: 1,
                                id: 94,
                                color: 4,
                                shape: 4
                            },
                            {
                                rackPosition: 3,
                                id: 103,
                                color: 6,
                                shape: 1
                            }
                        ]
                    },
                    isTurn: true
                }
            ]
        };
        expect(toBoard(restboard)).toEqual({
          "boards": [
            {
              "color": 1,
              "disabled": false,
              "id": 2,
              "shape": 2,
              "x": 3,
              "y": -1
            },
            {
              "color": 1,
              "disabled": false,
              "id": 5,
              "shape": 5,
              "x": 4,
              "y": -1
            },
            {
              "color": 3,
              "disabled": false,
              "id": 16,
              "shape": 4,
              "x": 7,
              "y": 3
            },
            {
              "color": 4,
              "disabled": false,
              "id": 19,
              "shape": 1,
              "x": 2,
              "y": 0
            },
            {
              "color": 4,
              "disabled": false,
              "id": 21,
              "shape": 3,
              "x": 1,
              "y": 0
            },
            {
              "color": 5,
              "disabled": false,
              "id": 30,
              "shape": 6,
              "x": 3,
              "y": 2
            },
            {
              "color": 6,
              "disabled": false,
              "id": 31,
              "shape": 1,
              "x": 2,
              "y": 1
            },
            {
              "color": 1,
              "disabled": false,
              "id": 37,
              "shape": 1,
              "x": 2,
              "y": -1
            },
            {
              "color": 3,
              "disabled": false,
              "id": 49,
              "shape": 1,
              "x": 6,
              "y": 3
            },
            {
              "color": 4,
              "disabled": false,
              "id": 56,
              "shape": 2,
              "x": -1,
              "y": 0
            },
            {
              "color": 4,
              "disabled": false,
              "id": 58,
              "shape": 4,
              "x": 0,
              "y": 0
            },
            {
              "color": 4,
              "disabled": false,
              "id": 60,
              "shape": 6,
              "x": -2,
              "y": 0
            },
            {
              "color": 5,
              "disabled": false,
              "id": 63,
              "shape": 3,
              "x": 4,
              "y": 2
            },
            {
              "color": 5,
              "disabled": false,
              "id": 65,
              "shape": 5,
              "x": 1,
              "y": 2
            },
            {
              "color": 3,
              "disabled": false,
              "id": 86,
              "shape": 2,
              "x": 5,
              "y": 3
            },
            {
              "color": 3,
              "disabled": false,
              "id": 87,
              "shape": 3,
              "x": 4,
              "y": 3
            },
            {
              "color": 3,
              "disabled": false,
              "id": 89,
              "shape": 5,
              "x": 8,
              "y": 3
            },
            {
              "color": 5,
              "disabled": false,
              "id": 97,
              "shape": 1,
              "x": 2,
              "y": 2
            }
          ],
          "players": [
            {
              "gameId": 2,
              "gamePosition": 2,
              "id": 3,
              "isTurn": false,
              "lastTurnPoints": 5,
              "points": 22,
              "pseudo": "Thomas",
              "rack": {
                "tiles": [
                  {
                    "color": 1,
                    "id": 1,
                    "rackPosition": 0,
                    "shape": 1
                  },
                  {
                    "color": 6,
                    "id": 33,
                    "rackPosition": 0,
                    "shape": 3
                  },
                  {
                    "color": 5,
                    "id": 61,
                    "rackPosition": 0,
                    "shape": 1
                  },
                  {
                    "color": 5,
                    "id": 66,
                    "rackPosition": 2,
                    "shape": 6
                  },
                  {
                    "color": 2,
                    "id": 82,
                    "rackPosition": 5,
                    "shape": 4
                  },
                  {
                    "color": 4,
                    "id": 92,
                    "rackPosition": 0,
                    "shape": 2
                  }
                ]
              },
              "userId": 3
            },
            {
              "gameId": 2,
              "gamePosition": 1,
              "id": 4,
              "isTurn": true,
              "lastTurnPoints": 6,
              "points": 19,
              "pseudo": "Jean charles",
              "rack": {
                "tiles": [
                  {
                    "color": 1,
                    "id": 41,
                    "rackPosition": 1,
                    "shape": 5
                  },
                  {
                    "color": 2,
                    "id": 45,
                    "rackPosition": 0,
                    "shape": 3
                  },
                  {
                    "color": 6,
                    "id": 67,
                    "rackPosition": 0,
                    "shape": 1
                  },
                  {
                    "color": 4,
                    "id": 91,
                    "rackPosition": 2,
                    "shape": 1
                  },
                  {
                    "color": 4,
                    "id": 94,
                    "rackPosition": 1,
                    "shape": 4
                  },
                  {
                    "color": 6,
                    "id": 103,
                    "rackPosition": 3,
                    "shape": 1
                  }
                ]
              },
              "userId": 3
            }
          ]
        });
    });
    it('should return Rack with restRack', () => {
        const rack: RestRack = {
            code: 0,
            tilesPlayed: [],
            newRack: [],
            points: 0
        };
        expect(toChangeRack(rack)).toEqual({
            code: 0,
            newRack: [],
            points: 0,
            tilesPlayed: []
        });
    });
    it('should return rack tile to play', () => {
        const result: Tile[] = [
            {
                color: 1,
                disabled: false,
                id: 2,
                shape: 2,
                x: 3,
                y: -1
            },
            {
                color: 1,
                disabled: false,
                id: 5,
                shape: 5,
                x: 4,
                y: -1
            },
            {
                color: 3,
                disabled: false,
                id: 16,
                shape: 4,
                x: 7,
                y: 3
            },
            {
                color: 4,
                disabled: false,
                id: 19,
                shape: 1,
                x: 2,
                y: 0
            },
            {
                color: 4,
                disabled: false,
                id: 21,
                shape: 3,
                x: 1,
                y: 0
            },
            {
                color: 5,
                disabled: false,
                id: 30,
                shape: 6,
                x: 3,
                y: 2
            }
        ];
        const playerId = 1;

        expect(fromBoard(result, playerId)).toEqual([
            {
                playerId: 1,
                tileId: 2,
                x: 3,
                y: -1
            },
            {
                playerId: 1,
                tileId: 5,
                x: 4,
                y: -1
            },
            {
                playerId: 1,
                tileId: 16,
                x: 7,
                y: 3
            },
            {
                playerId: 1,
                tileId: 19,
                x: 2,
                y: 0
            },
            {
                playerId: 1,
                tileId: 21,
                x: 1,
                y: 0
            },
            {
                playerId: 1,
                tileId: 30,
                x: 3,
                y: 2
            }
        ]);
    });
    it('should return rack tile to swap', () => {
        const result: Tile[] = [
            {
                color: 1,
                disabled: false,
                id: 2,
                shape: 2,
                x: 3,
                y: -1
            },
            {
                color: 1,
                disabled: false,
                id: 5,
                shape: 5,
                x: 4,
                y: -1
            },
            {
                color: 3,
                disabled: false,
                id: 16,
                shape: 4,
                x: 7,
                y: 3
            },
            {
                color: 4,
                disabled: false,
                id: 19,
                shape: 1,
                x: 2,
                y: 0
            },
            {
                color: 4,
                disabled: false,
                id: 21,
                shape: 3,
                x: 1,
                y: 0
            },
            {
                color: 5,
                disabled: false,
                id: 30,
                shape: 6,
                x: 3,
                y: 2
            }
        ];
        const playerId = 1;

        expect(fromBag(result, playerId)).toEqual([
            {
                playerId: 1,
                tileId: 2
            },
            {
                playerId: 1,
                tileId: 5
            },
            {
                playerId: 1,
                tileId: 16
            },
            {
                playerId: 1,
                tileId: 19
            },
            {
                playerId: 1,
                tileId: 21
            },
            {
                playerId: 1,
                tileId: 30
            }
        ]);
    });
});
