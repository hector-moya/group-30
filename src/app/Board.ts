import { Piece } from "./Piece";
import { TETROMINOS, EXT_TETROMINOS } from "../defs.d";

export class Board {

    private grid: number[][]; // The grid

    piece: Piece;

    constructor(public ctx: CanvasRenderingContext2D) {
        this.grid = Array.from({ length: 20 }, () => Array(10).fill(0));
        this.piece = new Piece(ctx);
    }

    /**
     * Rotate the piece clockwise
     * @param {Piece} piece - The piece to rotate
     */
    rotate(piece: Piece): Piece {

        const rotatedPiece = JSON.parse(JSON.stringify(piece));

        for (let y = 0; y < rotatedPiece.shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [rotatedPiece.shape[x][y], rotatedPiece.shape[y][x]] = [rotatedPiece.shape[y][x], rotatedPiece.shape[x][y]];
            }
        }

        rotatedPiece.shape.forEach((row: number[]) => row.reverse());

        return rotatedPiece;
    }

    /**
     * Check if the piece is out of bounds
     * @param {Piece} piece - The piece to check
     * @returns {boolean} Whether the piece is out of bounds
     */
    isPieceOutOfBounds(piece: Piece): boolean {
        return piece.shape.some((row: number[], dy: number) => {
            return row.some((value: number, dx: number) => {
                const x = piece.x + dx;
                const y = piece.y + dy;
                return value && (x < 0 || x >= 10 || y >= 20 || this.grid[y][x] !== 0);
            });
        });
    }


    /**
     * Merge the piece into the board
     * @param piece 
     */
    merge(piece: Piece): void {
        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.grid[piece.y + y][piece.x + x] = value;
                }
            });
        });
    }

    // Method to draw the entire board
    /**
     * Draw the board
     * @returns {void}
     */
    // Method to draw the entire board
    drawStatic(): void {
        // Clear the entire canvas
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Combine the normal and extended tetrominos
        const allTetrominos = [...Object.values(TETROMINOS), ...Object.values(EXT_TETROMINOS)];

        // Create an array of colors based on the combined tetrominos
        const colors = allTetrominos.map(tetromino => tetromino.color);

        // Iterate over each row
        for (let y = 0; y < this.grid.length; y++) {
            // Iterate over each column
            for (let x = 0; x < this.grid[y].length; x++) {
                // Get the value of the current cell
                const value = this.grid[y][x];

                // If the value is greater than 0, draw a block
                if (value > 0) {
                    // Get the color from the colors array
                    const color = colors[value - 1] || "";

                    // Set the fill style to the determined color
                    this.ctx.fillStyle = color;

                    // Draw the block at the corresponding position on the canvas
                    this.ctx.fillRect(x, y, 1, 1); // Assuming each block is 1x1 unit
                }
            }
        }
    }


    /**
     * Clear the lines that are filled
     * @returns {void}
     */
    clearLines(): void {
        let linesCleared = 0;

        // Iterate through the grid from the bottom up
        for (let y = this.grid.length - 1; y >= 0; y--) {
            const row = this.grid[y];

            // Check if every cell in the row is filled
            if (row.every(value => value > 0)) {
                // Remove the completed line
                this.grid.splice(y, 1);

                // Add a new empty row at the top
                this.grid.unshift(new Array(this.grid[0].length).fill(0));

                // Increment the count of lines cleared
                linesCleared++;

                // Increment y to recheck the current row index since the rows have shifted down
                y++;
            }
        }
    }

}