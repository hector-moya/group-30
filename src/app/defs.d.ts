/**
 * Game configuration settings
 */
export interface GameConfig {
    rows: number;
    columns: number;
    blockSize: number;
    extended: boolean;
    startLevel: number;
}

/**
 * Tetrominos details
 */
export interface Tetromino {
    matrix: number[][];
    color: string;
}

/**
 * Game stats for scoring and levels
 */
export interface GameStats {
    score: number;
    lines: number;
    level: number;
    levelUp: number;
}

/**
 * Points for clearing lines
 */
export interface Point {
    [key: number]: number;
}


/**
 * High score details
 */
export interface HighScore {
    playerName: string;
    score: number;
}
