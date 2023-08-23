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
        this.render();
    }

    
     // this will not live here, it is just for testing
     render() {
        this.ctx!.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx!.fillRect(this.x + x, this.y + y, 1, 1);
                }
            });
        });
    }

}