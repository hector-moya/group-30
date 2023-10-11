import { HighScore, IGameStats, Point } from "./interfaces/Score";
import { ITetromino } from "./interfaces/Tetromino";
import { IConfig } from "./interfaces/Config";
import { Matrix } from "./defs";

export const DEFAULT_CONFIG: IConfig = {
    rows: 20,
    columns: 10,
    blockSize: 25,
    extended: true,
    startLevel: 1,
    nextGridSize: 4,
    hasSound: false,
}

export const GAME_STATS: IGameStats = {
    score: 0,
    lines: 0,
    level: 1,
    levelUp: 10
}

export const TETROMINOS: { [key: string]: ITetromino } = {
    I: { id: 1, shape: [[1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0]], color: 'rgba(0, 128, 128, 1)' },
    J: { id: 2, shape: [[2, 0, 0], [2, 2, 2], [0, 0, 0]], color: 'rgba(0, 0, 255, 1)' },
    L: { id: 3, shape: [[0, 0, 3], [3, 3, 3], [0, 0, 0]], color: 'rgba(255, 165, 0, 1)' },
    O: { id: 4, shape: [[4, 4], [4, 4]], color: 'rgba(255, 255, 0, 1)' },
    S: { id: 5, shape: [[0, 5, 5], [5, 5, 0], [0, 0, 0]], color: 'rgba(0, 128, 0, 1)' },
    T: { id: 6, shape: [[0, 6, 0], [6, 6, 6], [0, 0, 0]], color: 'rgba(128, 0, 128, 1)' },
    Z: { id: 7, shape: [[7, 7, 0], [0, 7, 7], [0, 0, 0]], color: 'rgba(255, 0, 0, 1)' },
};

// export const TETROMINOS: { [key: string]: ITetromino } = {
//     I: { id: 1, shape: [[1, 1, 1, 1]], color: 'rgba(0, 128, 128, 1)' },
//     J: { id: 2, shape: [[2, 2, 2, 2]], color: 'rgba(0, 0, 255, 1)' },
//     L: { id: 3, shape: [[3, 3, 3, 3]], color: 'rgba(255, 165, 0, 1)' },
//     O: { id: 4, shape: [[4, 4, 4, 4]], color: 'rgba(255, 255, 0, 1)' },
//     S: { id: 5, shape: [[5, 5, 5, 5]], color: 'rgba(0, 128, 0, 1)' },
//     T: { id: 6, shape: [[6, 6, 6, 6]], color: 'rgba(128, 0, 128, 1)' },
//     Z: { id: 7, shape: [[7, 7, 7, 7]], color: 'rgba(255, 0, 0, 1)' },
// };

/**
 * extended tetrominos each with 3 squares for 'extended' game
 */
export const EXT_TETROMINOS: { [key: string]: ITetromino } = {
    IE: { id: 8, shape: [[8, 0, 0], [8, 0, 0], [8, 0, 0]], color: 'rgba(135, 206, 235, 1)' },
    LE: { id: 9, shape: [[9, 0, 0], [9, 9, 0], [0, 0, 0]], color: 'rgba(255 ,192, 203, 1)' }
};

/**
 * points allocation for clearing lines
 */
export const POINTS: Point = {
    1: 100,
    2: 300,
    3: 600,
    4: 1000
};

/**
 * Dummy high scores
 */
export const HIGH_SCORES: HighScore[] = [
    { playerName: 'Luna', score: 480 },
    { playerName: 'Nova', score: 5200 },
    { playerName: 'Aria', score: 4500 },
    { playerName: 'Finn', score: 8000 },
    { playerName: 'Ella', score: 3470 },
    { playerName: 'Leo', score: 6000 },
    { playerName: 'Owen', score: 1510 },
    { playerName: 'Zoe', score: 4600 },
    { playerName: 'Aiden', score: 5000 },
    { playerName: 'Eli', score: 3000 },
];


/**
 * Dummy grid matrix for testing
 */
// export const GRID: Matrix = [
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 3, 3],
//     [0, 0, 0, 0, 7, 7, 6, 6, 6, 3],
//     [1, 1, 1, 1, 5, 5, 7, 6, 5, 3],
//     [0, 0, 5, 5, 4, 4, 2, 0, 5, 5],
//     [1, 1, 1, 1, 4, 4, 2, 2, 2, 5],
// ];

export const GRID: Matrix = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [7, 0, 7, 7, 7, 7, 7, 7, 7, 7],
    [6, 6, 0, 6, 6, 6, 6, 6, 6, 6],
    [5, 5, 0, 5, 5, 5, 5, 5, 5, 5],
    [4, 4, 4, 0, 4, 4, 4, 4, 4, 4],
    [3, 3, 3, 0, 3, 3, 3, 3, 3, 3],
    [2, 2, 2, 0, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [7, 7, 7, 7, 0, 7, 7, 7, 7, 7],
    [6, 6, 6, 6, 0, 6, 6, 6, 6, 6],
    [5, 5, 5, 5, 0, 5, 5, 5, 5, 5],
];
// export const GRID: Matrix = [
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [7, 0, 7, 7, 7, 7, 7, 7, 7, 7],
//     [6, 0, 6, 6, 6, 6, 6, 6, 6, 6],
//     [5, 5, 0, 5, 5, 5, 5, 5, 5, 5],
//     [4, 4, 0, 4, 4, 4, 4, 4, 4, 4],
//     [3, 3, 3, 0, 3, 3, 3, 3, 3, 3],
//     [2, 2, 2, 0, 2, 2, 2, 2, 2, 2],
//     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//     [7, 7, 7, 7, 7, 7, 0, 7, 7, 7],
//     [6, 6, 6, 6, 6, 6, 0, 6, 6, 6],
//     [5, 5, 5, 5, 5, 5, 5, 0, 5, 5],
//     [4, 4, 4, 4, 4, 4, 4, 0, 4, 4],
//     [3, 3, 3, 3, 3, 3, 3, 3, 0, 3],
//     [2, 2, 2, 2, 2, 2, 2, 2, 0, 2],
//     [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
//     // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//     // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//     // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
// ];
