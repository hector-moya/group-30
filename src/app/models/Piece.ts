import { GameConfig, Tetromino } from "../defs";

export class Piece {

    private shape: number[][];
    private color: string;
    private x: number = 3; // start at middle
    private y: number = 0; // start at top

    private gameConfig!: GameConfig;
    private stepInterval: ReturnType<typeof setInterval> | undefined;

    constructor(private ctx: CanvasRenderingContext2D, tetromino: Tetromino, gameConfig: GameConfig) {
        this.ctx = ctx;
        this.shape = tetromino.matrix;
        this.color = tetromino.color;
        this.gameConfig = gameConfig;
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

    /**
     * Determine if a tetromino is allowed to move
     *
     * @param {Piece} piece The tetromino object to be checked.
     * @returns {boolean} The movable state
     */
    canMove(piece: Piece): boolean {
        // `matrix.every` checks if every row of the shape meets the conditions
        return piece.shape.every((row, rowIndex) => {
            // `row.every` checks if every value (cell) in the row meets the conditions.
            return row.every((value, columnIndex) => {
                // Calculate the actual x and y position on the board for the current cell.
                let x = piece.x + columnIndex;
                let y = piece.y + rowIndex;

                return value === 0 || this.isInBoundary(x, y);
            });
        });
    }

    /**
     * Check if the piece is within the boundary of the canvas
     * @param x The x position of the piece
     * @param y The y position of the piece
     * @returns True if the piece is within the boundary, false otherwise
     */
    private isInBoundary(x: number, y: number): boolean {
        // NK!! there is a problem with this logic because it is working form
        // where the values are and now where they will be. I have just made
        // it work but we will need to make sure it is getting the correct
        // values dynamically
        return (x - 1) >= 0
            && (x + 1) < this.gameConfig.columns
            && (y + 1) < this.gameConfig.rows;
    }

}
