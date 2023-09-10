/**
 * Game stats for scoring and levels
 */
export interface IGameStats {
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
