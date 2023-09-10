import { ITetromino } from "./Tetromino";

export interface IPiece extends ITetromino {
    x: number;
    y: number;
}
