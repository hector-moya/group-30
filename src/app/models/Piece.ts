import { Tetromino } from "../defs";

export class Piece {

    private shape: number[][];
    private color: string;
    private x: number = 3; // start at middle
    private y: number = 0; // start at top

    private stepInterval: ReturnType<typeof setInterval> | undefined;

    constructor(private ctx: CanvasRenderingContext2D, tetromino: Tetromino) {
        this.ctx = ctx;
        this.shape = tetromino.matrix;
        this.color = tetromino.color;
        // this.startInterval();
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

    /**
     * Clear the entire canvas (only clears the current piece)
     */
    private clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    }

    moveLeft() {
        this.x -= 1;
        this.clear();
        this.render();
    }

    moveRight() {
        this.x += 1;
        this.clear();
        this.render();
    }

    moveDown() {
        this.y += 1;
        this.clear();
        this.render();
    }

    /**
     * Rotate the piece clockwise
     */
    rotate(): void {
        // Transpose the matrix
        for (let y = 0; y < this.shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [this.shape[x][y], this.shape[y][x]] = [this.shape[y][x], this.shape[x][y]];
            }
        }

        // Reverse each row
        this.shape.forEach((row) => row.reverse());

        // Re-render the piece
        this.clear();
        this.render();
    }

    startInterval(time: number = 1000) {
        if (!this.stepInterval) {
            this.stepInterval = setInterval(() => {
                this.moveDown();
            }, time);
        }
    }

    stopInterval() {
        if (this.stepInterval) {
            clearInterval(this.stepInterval);
            this.stepInterval = undefined; // Reset the interval ID
        }
    }

}