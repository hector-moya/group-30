import { ITetromino } from "../interfaces/Tetromino";
import { IPiece } from "../interfaces/Piece";
import { IConfig } from "../interfaces/Config";

export class Piece implements IPiece {

    public x: number;
    public y: number = 0;
    public matrix: Matrix;
    public color: string;

    constructor(
        private ctx: CanvasRenderingContext2D,
        public tetromino: ITetromino,
        private config: IConfig,
        public type: string = 'current'
    ) {
        this.matrix = tetromino.matrix;
        this.color = tetromino.color;
        this.x = this.centerXPosition(this.matrix);
        this.render();
    }

    /**
     * Move the piece, clear the canvas and render in the new position
     * @param piece - The piece containing the new position and shape.
     */
    move(piece: Piece): void {
        this.x = piece.x;
        this.y = piece.y;
        this.matrix = piece.matrix; // update matrix with new orientation
        this.clear();
        this.render();
    }

    /**
     * Rotate a Tetromino piece clockwise
     *
     * @param {Piece} piece The Tetromino piece to be rotated
     * @returns {Piece} The rotated Tetromino piece
     */
    rotate(piece: Piece): Piece {
        const currentMatrix = piece.matrix;
        const transposedMatrix = this.transposeMatrix(currentMatrix);
        // Replace existing piece matrix with the rotated transposed matrix
        piece.matrix = transposedMatrix;

        return piece;
    }

    /**
     * Clear the entire canvas (only clears the current piece)
     */
    private clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    }

    /**
     * Render the piece on the canvas
     */
    private render() {
        this.ctx!.fillStyle = this.color;
        this.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx!.fillRect(this.x + x, this.y + y, 1, 1);
                }
            });
        });
    }

    /**
     * Transpose a matrix by rotating it clockwise
     *
     * original         transposed
     * [a, b, c]   =>   [a, d, g]
     * [d, e, f]   =>   [b, e, h]
     * [g, h, i]   =>   [c, f, i]
     *
     * @param matrix The original matrix to be transposed
     * @returns The transposed matrix (rotated clockwise)
     */
    private transposeMatrix(matrix: Matrix): Matrix {
        const numRows = matrix.length;
        const numCols = matrix[0].length;

        // Create a new matrix for the rotated values
        const rotatedMatrix = new Array(numCols).fill(null).map(() => new Array(numRows));

        // Loop through rows and columns to perform rotation
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                // Rotate the values by swapping rows and columns
                rotatedMatrix[col][numRows - 1 - row] = matrix[row][col];
            }
        }

        return rotatedMatrix;
    }

    /**
     * Calculate the center x position of a matrix
     * @param {Matrix} matrix - The matrix to be checked
     * @returns {number} The center x position of the matrix
     */
    private centerXPosition(matrix: Matrix): number {
        const columns = this.type === 'next'
            ? this.config.nextGridSize
            : this.config.columns;
        return Math.floor((columns! - this.calculateMaxWidth(matrix)) / 2);
    }

    /**
     * Helper function to calculate the maximum width of a matrix
     * @param {Matrix} matrix - The matrix to be checked
     * @returns {number} The maximum width of the matrix
     */
    private calculateMaxWidth(matrix: Matrix): number {
        let maxWidth = 0;

        for (let row = 0; row < matrix.length; row++) {
            let rowWidth = 0;

            for (let col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col] > 0) {
                    rowWidth = col + 1; // Increment the row width when a non-zero value is encountered
                }
            }

            if (rowWidth > maxWidth) {
                maxWidth = rowWidth; // Update the maximum width if the current row width is greater
            }
        }

        return maxWidth;
    }

    /**
    * Determine if a tetromino is allowed to move
    * @param {Piece} piece The tetromino object to be checked.
    * @returns {boolean} The movable state
    */
    canMove(piece: Piece, xOffset: number, yOffset: number): boolean {
        // `matrix.every` checks if every row of the shape meets the conditions
        return piece.matrix.every((row, rowIndex) => {
            // `row.every` checks if every value (cell) in the row meets the conditions.
            return row.every((value, columnIndex) => {
                // Calculate the actual x and y position on the board for the current cell.
                let x = piece.x + columnIndex + xOffset;
                let y = piece.y + rowIndex + yOffset;

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
        return x >= 0
            && x < this.config.columns
            && y < this.config.rows;
    }


    /**
     *
     *
     *
     * FOR REVIEW
     *
     *
     *
     *
     *
     *
     */

    // startInterval(time: number = 1000) {
    //     if (!this.stepInterval) {
    //         this.stepInterval = setInterval(() => {
    //             this.move('down');
    //         }, time);
    //     }
    // }

    // stopInterval() {
    //     if (this.stepInterval) {
    //         clearInterval(this.stepInterval);
    //         this.stepInterval = undefined; // Reset the interval ID
    //     }
    // }

    // move(direction: 'left' | 'right' | 'down' | 'rotate'): void {
    //     if (this.bottomCollision) return; // If the piece has bottom collision, do not allow further movement.
    //     let xOffset = 0;
    //     let yOffset = 0;

    //     switch (direction) {
    //         case 'left':
    //             xOffset = -1;
    //             break;
    //         case 'right':
    //             xOffset = 1;
    //             break;
    //         case 'down':
    //             yOffset = 1;
    //             break;
    //         case 'rotate':
    //             this.rotate();
    //             return;
    //     }
    //     if (this.canMove(this, xOffset, yOffset)) {
    //         this.x += xOffset;
    //         this.y += yOffset;
    //         this.clear();
    //         this.render();
    //     } else if (direction === 'down') {
    //         // If the piece is unable to move down, it means it has bottom collision and should not move further
    //         this.bottomCollision = true;
    //         this.stopInterval(); // Stop the interval

    //     }
    // }
}
