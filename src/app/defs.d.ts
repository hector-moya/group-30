/**
 * Game configuration settings
 */
export interface Config {
    rows: number;
    columns: number;
    blockSize: number;
    extended: boolean;
}

/**
 * Tetrominos details
 */
export interface Tetromino {
    matrix: number[][];
    color: string;
}
