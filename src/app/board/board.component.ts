import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Piece } from '../Piece';
import { Config } from '../defs';

@Component({
    selector: 'app-board',
    standalone: true,
    imports: [CommonModule],
    template: `<canvas #board class="bdr-red bdr-3"></canvas>`,
    styles: []
})
export class BoardComponent {

    @ViewChild('board', { static: true }) board!: ElementRef<HTMLCanvasElement>;

    private ctx: CanvasRenderingContext2D | null = null;
    private config: Config;
    piece: Piece;

    constructor() {
        this.config = { columns: 10, rows: 20, blockSize: 30, extended: false };
        this.piece = new Piece(this.ctx!);
    }

    ngAfterViewInit() {
        this.setupGameBoard();
        console.log(this.piece);
    }

    /**
     * Sets up the canvas element and its rendering context.
     */
    setupGameBoard(): void {

        // Find the canvas element
        const canvas: HTMLCanvasElement = this.board.nativeElement;

        // Check if the canvas element exists
        if (!canvas) {
            throw new Error("Canvas element not found.");
        }

        // Get the 2D rendering context of the canvas
        this.ctx = canvas.getContext('2d');

        // If the context is available, configure the canvas properties
        if (this.ctx) {
            this.ctx.canvas.width = this.config.columns * this.config.blockSize;
            this.ctx.canvas.height = this.config.rows * this.config.blockSize;
            this.ctx.scale(this.config.blockSize, this.config.blockSize);
        } else {
            throw new Error("There is something wrong with the Canvas class.");
        }
    }

    // ======================================================================

    /**
     * Rotate a Tetromino piece clockwise
     *
     * @param {Piece} piece The Tetromino piece to be rotated
     * @returns {Piece} The rotated Tetromino piece
     */
    rotate(piece: Piece): Piece {

        const currentMatrix = piece.shape;
        const transposedMatrix = this.transposeMatrix(currentMatrix);

        // Replace existing shape matrix with the rotated transposed matrix
        piece.shape = transposedMatrix;

        return piece;
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
    transposeMatrix(matrix: number[][]): number[][] {
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

                // NK?? I think this is where we will to add collision detection
                return value === 0 || this.isInBoundary(x, y);
            });
        });
    }

    // TD!! need to update back to gameConfig when the setup is separated
    isInBoundary(x: number, y: number) {
        return x >= 0 && x < this.config.columns && y >= 0 && y < this.config.rows;
        // return x >= 0 && x < gameConfig.columns && y >= 0 && y < gameConfig.rows;
    }
}



