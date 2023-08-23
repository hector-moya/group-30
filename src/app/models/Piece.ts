import { Tetromino } from "../defs";

export class Piece {

    shape: number[][];
    color: string;
    x: number = 3; // start at middle
    y: number = 0; // start at top

    constructor(private ctx: CanvasRenderingContext2D, tetromino: Tetromino) {
        this.ctx = ctx;
        this.shape = tetromino.matrix;
        this.color = tetromino.color;
    }

}