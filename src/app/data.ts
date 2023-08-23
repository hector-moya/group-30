import { Tetromino, Point, HighScore } from "./defs";

/**
 * default tetrominos each with 4 squares for `normal` game
 */
export const TETROMINOS: { [key: string]: Tetromino } = {
    I: { matrix: [[1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0]], color: 'teal' },
    J: { matrix: [[2, 0, 0], [2, 2, 2], [0, 0, 0]], color: 'blue' },
    L: { matrix: [[0, 0, 3], [3, 3, 3], [0, 0, 0]], color: 'orange' },
    O: { matrix: [[4, 4], [4, 4]], color: 'yellow' },
    S: { matrix: [[0, 5, 5], [5, 5, 0], [0, 0, 0]], color: 'green' },
    T: { matrix: [[0, 6, 0], [6, 6, 6], [0, 0, 0]], color: 'purple' },
    Z: { matrix: [[7, 7, 0], [0, 7, 7], [0, 0, 0]], color: 'red' },
};

/**
 * extended tetrominos each with 3 squares for 'extended' game
 */
export const EXT_TETROMINOS: { [key: string]: Tetromino } = {
    IE: { matrix: [[0, 0, 0, 0], [8, 8, 8, 0], [0, 0, 0, 0], [0, 0, 0, 0]], color: 'sky' },
    LE: { matrix: [[9, 0, 0], [9, 9, 0], [0, 0, 0]], color: 'pink' }
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
    { playerName: 'Luna', score: 48000 },
    { playerName: 'Nova', score: 52000 },
    { playerName: 'Aria', score: 45000 },
    { playerName: 'Finn', score: 43000 },
    { playerName: 'Ella', score: 47000 },
    { playerName: 'Leo', score: 49000 },
    { playerName: 'Mia', score: 44000 },
    { playerName: 'Owen', score: 51000 },
    { playerName: 'Zoe', score: 46000 },
    { playerName: 'Aiden', score: 50000 },
    { playerName: 'Eli', score: 47000 },
];
