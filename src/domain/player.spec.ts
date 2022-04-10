import {
    fromSwap,
    fromBoard,
    Player,
    RestBoard,
    RestRack,
    toBoard,
    toChangeRack,
    toPlayers,
    toWebPlayer,
    TilesOnBag
} from './player';
import { TileFront } from './Tile';

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
            rack: { tiles: [],
              tilesNumber: 0 },

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
            rack: { tiles: [] ,
              tilesNumber: 0},
            isTurn: true
        };
        expect(toWebPlayer(player)).toEqual(1);
    });
    it('should return players with restboard ', () => {
        const restboard: RestBoard = {
            bag: { tiles: [] },
            board: {
                tiles: [
                    {
                        coordinate: {
                            x: 3,
                            y: -1
                        },
                        color: 1,
                        shape: 2
                    },
                    {
                        coordinate: {
                            x: 4,
                            y: -1
                        },
                        color: 1,
                        shape: 5
                    },
                    {
                        coordinate: {
                            x: 7,
                            y: 3
                        },

                        color: 3,
                        shape: 4
                    },
                    {
                        coordinate: {
                            x: 2,
                            y: 0
                        },

                        color: 4,
                        shape: 1
                    },
                    {
                        coordinate: {
                            x: 1,
                            y: 0
                        },

                        color: 4,
                        shape: 3
                    },
                    {
                        coordinate: {
                            x: 3,
                            y: 2
                        },

                        color: 5,
                        shape: 6
                    },
                    {
                        coordinate: {
                            x: 2,
                            y: 1
                        },

                        color: 6,
                        shape: 1
                    },
                    {
                        coordinate: {
                            x: 2,
                            y: -1
                        },

                        color: 1,
                        shape: 1
                    },
                    {
                        coordinate: {
                            x: 6,
                            y: 3
                        },

                        color: 3,
                        shape: 1
                    },
                    {
                        coordinate: {
                            x: -1,
                            y: 0
                        },

                        color: 4,
                        shape: 2
                    },
                    {
                        coordinate: {
                            x: 0,
                            y: 0
                        },

                        color: 4,
                        shape: 4
                    },
                    {
                        coordinate: {
                            x: -2,
                            y: 0
                        },

                        color: 4,
                        shape: 6
                    },
                    {
                        coordinate: {
                            x: 4,
                            y: 2
                        },

                        color: 5,
                        shape: 3
                    },
                    {
                        coordinate: {
                            x: 1,
                            y: 2
                        },

                        color: 5,
                        shape: 5
                    },
                    {
                        coordinate: {
                            x: 5,
                            y: 3
                        },

                        color: 3,
                        shape: 2
                    },
                    {
                        coordinate: {
                            x: 4,
                            y: 3
                        },

                        color: 3,
                        shape: 3
                    },
                    {
                        coordinate: {
                            x: 8,
                            y: 3
                        },

                        color: 3,
                        shape: 5
                    },
                    {
                        coordinate: {
                            x: 2,
                            y: 2
                        },

                        color: 5,
                        shape: 1
                    }
                ]
            },
            players: [
                {
                    id: 3,
                    pseudo: 'Thomas',
                    userId: 3,
                    gameId: 2,
                    gamePosition: 2,
                    points: 22,
                    lastTurnPoints: 5,
                    rack: {
                        tiles: [
                            {
                                rackPosition: 0,
                                color: 1,
                                shape: 1
                            },
                            {
                                rackPosition: 0,
                                color: 6,
                                shape: 3
                            },
                            {
                                rackPosition: 0,
                                color: 5,
                                shape: 1
                            },
                            {
                                rackPosition: 2,
                                color: 5,
                                shape: 6
                            },
                            {
                                rackPosition: 5,
                                color: 2,
                                shape: 4
                            },
                            {
                                rackPosition: 0,
                                color: 4,
                                shape: 2
                            }
                        ],
                      tilesNumber: 0
                    },
                    isTurn: false
                },
                {
                    id: 4,
                    pseudo: 'Jean charles',
                    userId: 3,
                    gameId: 2,
                    gamePosition: 1,
                    points: 19,
                    lastTurnPoints: 6,
                    rack: {
                        tiles: [
                            {
                                rackPosition: 1,
                                color: 1,
                                shape: 5
                            },
                            {
                                rackPosition: 0,
                                color: 2,
                                shape: 3
                            },
                            {
                                rackPosition: 0,
                                color: 6,
                                shape: 1
                            },
                            {
                                rackPosition: 2,
                                color: 4,
                                shape: 1
                            },
                            {
                                rackPosition: 1,
                                color: 4,
                                shape: 4
                            },
                            {
                                rackPosition: 3,
                                color: 6,
                                shape: 1
                            }
                        ],
                      tilesNumber: 0
                    },
                    isTurn: true
                }
            ]
        };
        expect(toPlayers(restboard)).toEqual([
            {
                gameId: 2,
                gamePosition: 2,
                id: 3,
                isTurn: false,
                lastTurnPoints: 5,
                points: 22,
                pseudo: 'Thomas',
                rack: {
                    tiles: [
                        {
                            color: 1,
                            rackPosition: 0,
                            shape: 1
                        },
                        {
                            color: 6,
                            rackPosition: 0,
                            shape: 3
                        },
                        {
                            color: 5,
                            rackPosition: 0,
                            shape: 1
                        },
                        {
                            color: 5,
                            rackPosition: 2,
                            shape: 6
                        },
                        {
                            color: 2,
                            rackPosition: 5,
                            shape: 4
                        },
                        {
                            color: 4,
                            rackPosition: 0,
                            shape: 2
                        }
                    ],tilesNumber: 0
                },
                userId: 3
            },
            {
                gameId: 2,
                gamePosition: 1,
                id: 4,
                isTurn: true,
                lastTurnPoints: 6,
                points: 19,
                pseudo: 'Jean charles',
                rack: {
                    tiles: [
                        {
                            color: 1,
                            rackPosition: 1,
                            shape: 5
                        },
                        {
                            color: 2,
                            rackPosition: 0,
                            shape: 3
                        },
                        {
                            color: 6,
                            rackPosition: 0,
                            shape: 1
                        },
                        {
                            color: 4,
                            rackPosition: 2,
                            shape: 1
                        },
                        {
                            color: 4,
                            rackPosition: 1,
                            shape: 4
                        },
                        {
                            color: 6,
                            rackPosition: 3,
                            shape: 1
                        }
                    ],tilesNumber: 0
                },
                userId: 3
            }
        ]);
    });
    it("should return Boargame with mock restboard'", () => {
        const restboard: RestBoard = {
            bag: { tiles: [] },
            board: {
                tiles: [
                    {
                        coordinate: {
                            x: 3,
                            y: -1
                        },
                        color: 1,
                        shape: 2
                    },
                    {
                        coordinate: {
                            x: 4,
                            y: -1
                        },

                        color: 1,
                        shape: 5
                    },
                    {
                        coordinate: {
                            x: 7,
                            y: 3
                        },

                        color: 3,
                        shape: 4
                    },
                    {
                        coordinate: {
                            x: 2,
                            y: 0
                        },

                        color: 4,
                        shape: 1
                    },
                    {
                        coordinate: {
                            x: 1,
                            y: 0
                        },

                        color: 4,
                        shape: 3
                    },
                    {
                        coordinate: {
                            x: 3,
                            y: 2
                        },

                        color: 5,
                        shape: 6
                    },
                    {
                        coordinate: {
                            x: 2,
                            y: 1
                        },

                        color: 6,
                        shape: 1
                    },
                    {
                        coordinate: {
                            x: 2,
                            y: -1
                        },

                        color: 1,
                        shape: 1
                    },
                    {
                        coordinate: {
                            x: 6,
                            y: 3
                        },

                        color: 3,
                        shape: 1
                    },
                    {
                        coordinate: {
                            x: -1,
                            y: 0
                        },

                        color: 4,
                        shape: 2
                    },
                    {
                        coordinate: {
                            x: 0,
                            y: 0
                        },

                        color: 4,
                        shape: 4
                    },
                    {
                        coordinate: {
                            x: -2,
                            y: 0
                        },

                        color: 4,
                        shape: 6
                    },
                    {
                        coordinate: {
                            x: 4,
                            y: 2
                        },

                        color: 5,
                        shape: 3
                    },
                    {
                        coordinate: {
                            x: 1,
                            y: 2
                        },

                        color: 5,
                        shape: 5
                    },
                    {
                        coordinate: {
                            x: 5,
                            y: 3
                        },

                        color: 3,
                        shape: 2
                    },
                    {
                        coordinate: {
                            x: 4,
                            y: 3
                        },

                        color: 3,
                        shape: 3
                    },
                    {
                        coordinate: {
                            x: 8,
                            y: 3
                        },

                        color: 3,
                        shape: 5
                    },
                    {
                        coordinate: {
                            x: 2,
                            y: 2
                        },

                        color: 5,
                        shape: 1
                    }
                ]
            },
            players: [
                {
                    id: 3,
                    pseudo: 'Thomas',
                    userId: 3,
                    gameId: 2,
                    gamePosition: 2,
                    points: 22,
                    lastTurnPoints: 5,
                    rack: {
                        tiles: [
                            {
                                rackPosition: 0,
                                color: 1,
                                shape: 1
                            },
                            {
                                rackPosition: 0,
                                color: 6,
                                shape: 3
                            },
                            {
                                rackPosition: 0,
                                color: 5,
                                shape: 1
                            },
                            {
                                rackPosition: 2,
                                color: 5,
                                shape: 6
                            },
                            {
                                rackPosition: 5,
                                color: 2,
                                shape: 4
                            },
                            {
                                rackPosition: 0,
                                color: 4,
                                shape: 2
                            }
                        ],
                      tilesNumber: 0
                    },
                    isTurn: false
                },
                {
                    id: 4,
                    pseudo: 'Jean charles',
                    userId: 3,
                    gameId: 2,
                    gamePosition: 1,
                    points: 19,
                    lastTurnPoints: 6,
                    rack: {
                        tiles: [
                            {
                                rackPosition: 1,
                                color: 1,
                                shape: 5
                            },
                            {
                                rackPosition: 0,
                                color: 2,
                                shape: 3
                            },
                            {
                                rackPosition: 0,
                                color: 6,
                                shape: 1
                            },
                            {
                                rackPosition: 2,
                                color: 4,
                                shape: 1
                            },
                            {
                                rackPosition: 1,
                                color: 4,
                                shape: 4
                            },
                            {
                                rackPosition: 3,
                                color: 6,
                                shape: 1
                            }
                        ],
                      tilesNumber: 0
                    },
                    isTurn: true
                }
            ]
        };
        expect(toBoard(restboard)).toEqual({
            bag: {
                tiles: []
            },
            boards: [
                {
                    color: 1,
                    disabled: false,

                    shape: 2,
                    x: 3,
                    y: -1
                },
                {
                    color: 1,
                    disabled: false,

                    shape: 5,
                    x: 4,
                    y: -1
                },
                {
                    color: 3,
                    disabled: false,

                    shape: 4,
                    x: 7,
                    y: 3
                },
                {
                    color: 4,
                    disabled: false,

                    shape: 1,
                    x: 2,
                    y: 0
                },
                {
                    color: 4,
                    disabled: false,

                    shape: 3,
                    x: 1,
                    y: 0
                },
                {
                    color: 5,
                    disabled: false,

                    shape: 6,
                    x: 3,
                    y: 2
                },
                {
                    color: 6,
                    disabled: false,

                    shape: 1,
                    x: 2,
                    y: 1
                },
                {
                    color: 1,
                    disabled: false,

                    shape: 1,
                    x: 2,
                    y: -1
                },
                {
                    color: 3,
                    disabled: false,

                    shape: 1,
                    x: 6,
                    y: 3
                },
                {
                    color: 4,
                    disabled: false,

                    shape: 2,
                    x: -1,
                    y: 0
                },
                {
                    color: 4,
                    disabled: false,

                    shape: 4,
                    x: 0,
                    y: 0
                },
                {
                    color: 4,
                    disabled: false,

                    shape: 6,
                    x: -2,
                    y: 0
                },
                {
                    color: 5,
                    disabled: false,

                    shape: 3,
                    x: 4,
                    y: 2
                },
                {
                    color: 5,
                    disabled: false,

                    shape: 5,
                    x: 1,
                    y: 2
                },
                {
                    color: 3,
                    disabled: false,

                    shape: 2,
                    x: 5,
                    y: 3
                },
                {
                    color: 3,
                    disabled: false,

                    shape: 3,
                    x: 4,
                    y: 3
                },
                {
                    color: 3,
                    disabled: false,

                    shape: 5,
                    x: 8,
                    y: 3
                },
                {
                    color: 5,
                    disabled: false,

                    shape: 1,
                    x: 2,
                    y: 2
                }
            ],
            players: [
                {
                    gameId: 2,
                    gamePosition: 2,
                    id: 3,
                    isTurn: false,
                    lastTurnPoints: 5,
                    points: 22,
                    pseudo: 'Thomas',
                    rack: {
                        tiles: [
                            {
                                color: 1,

                                rackPosition: 0,
                                shape: 1
                            },
                            {
                                color: 6,

                                rackPosition: 0,
                                shape: 3
                            },
                            {
                                color: 5,

                                rackPosition: 0,
                                shape: 1
                            },
                            {
                                color: 5,

                                rackPosition: 2,
                                shape: 6
                            },
                            {
                                color: 2,

                                rackPosition: 5,
                                shape: 4
                            },
                            {
                                color: 4,

                                rackPosition: 0,
                                shape: 2
                            }
                        ],
                      tilesNumber: 0
                    },
                    userId: 3
                },
                {
                    gameId: 2,
                    gamePosition: 1,
                    id: 4,
                    isTurn: true,
                    lastTurnPoints: 6,
                    points: 19,
                    pseudo: 'Jean charles',
                    rack: {
                        tiles: [
                            {
                                color: 1,

                                rackPosition: 1,
                                shape: 5
                            },
                            {
                                color: 2,

                                rackPosition: 0,
                                shape: 3
                            },
                            {
                                color: 6,

                                rackPosition: 0,
                                shape: 1
                            },
                            {
                                color: 4,

                                rackPosition: 2,
                                shape: 1
                            },
                            {
                                color: 4,

                                rackPosition: 1,
                                shape: 4
                            },
                            {
                                color: 6,

                                rackPosition: 3,
                                shape: 1
                            }
                        ],
                      tilesNumber: 0
                    },
                    userId: 3
                }
            ]
        });
    });
    it('should return Rack with restRack', () => {
        const rack: RestRack = {
            code: 0,
            gameId: 0,
            move: {
                tilesPlayed: [],

                points: 0
            },
            newRack: []
        };
        expect(toChangeRack(rack)).toEqual({
            code: 0,
            newRack: [],
            points: 0,
            tilesPlayed: []
        });
    });
    it('should return rack tile to play', () => {
        const result: TileFront[] = [
            {
                color: 1,
                disabled: false,
                shape: 2,
                x: 3,
                y: -1
            },
            {
                color: 1,
                disabled: false,
                shape: 5,
                x: 4,
                y: -1
            },
            {
                color: 3,
                disabled: false,
                shape: 4,
                x: 7,
                y: 3
            },
            {
                color: 4,
                disabled: false,
                shape: 1,
                x: 2,
                y: 0
            },
            {
                color: 4,
                disabled: false,
                shape: 3,
                x: 1,
                y: 0
            },
            {
                color: 5,
                disabled: false,
                shape: 6,
                x: 3,
                y: 2
            }
        ];
        const playerId = 1;

        expect(fromBoard(result, playerId)).toEqual([
            {
                X: 3,
                Y: -1,
                color: 1,
                gameId: 1,
                shape: 2
            },
            {
                X: 4,
                Y: -1,
                color: 1,
                gameId: 1,
                shape: 5
            },
            {
                X: 7,
                Y: 3,
                color: 3,
                gameId: 1,
                shape: 4
            },
            {
                X: 2,
                Y: 0,
                color: 4,
                gameId: 1,
                shape: 1
            },
            {
                X: 1,
                Y: 0,
                color: 4,
                gameId: 1,
                shape: 3
            },
            {
                X: 3,
                Y: 2,
                color: 5,
                gameId: 1,
                shape: 6
            }
        ]);
    });
    it('should return rack tile to swap', () => {
        const result: TileFront[] = [
            {
                color: 1,
                disabled: false,
                shape: 2,
                x: 3,
                y: -1
            },
            {
                color: 1,
                disabled: false,
                shape: 5,
                x: 4,
                y: -1
            },
            {
                color: 3,
                disabled: false,
                shape: 4,
                x: 7,
                y: 3
            },
            {
                color: 4,
                disabled: false,
                shape: 1,
                x: 2,
                y: 0
            },
            {
                color: 4,
                disabled: false,
                shape: 3,
                x: 1,
                y: 0
            },
            {
                color: 5,
                disabled: false,
                shape: 6,
                x: 3,
                y: 2
            }
        ];
        const playerId = 1;

        expect(fromSwap(result, playerId)).toEqual([
            {
                X: 3,
                Y: -1,
                color: 1,
                gameId: 1,
                shape: 2
            },
            {
                X: 4,
                Y: -1,
                color: 1,
                gameId: 1,
                shape: 5
            },
            {
                X: 7,
                Y: 3,
                color: 3,
                gameId: 1,
                shape: 4
            },
            {
                X: 2,
                Y: 0,
                color: 4,
                gameId: 1,
                shape: 1
            },
            {
                X: 1,
                Y: 0,
                color: 4,
                gameId: 1,
                shape: 3
            },
            {
                X: 3,
                Y: 2,
                color: 5,
                gameId: 1,
                shape: 6
            }
        ]);
    });
});
