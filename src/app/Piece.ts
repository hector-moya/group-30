import { TETROMINOS, Tetromino, EXT_TETROMINOS } from "../defs.d";

export class Piece {

    shape: number[][];
    color: string;
    x: number = 3; // Initial x position
    y: number = 0; // Initial y position

    private readonly RandomTetromino: Tetromino;

    constructor(public ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.RandomTetromino = this.getRandomTetromino();
        this.shape = this.RandomTetromino.matrix;
        this.color = this.RandomTetromino.color;
    }

    /**
     * Method to get a random tetromino
     * @returns Tetromino
     */

    // getTestromino(): Tetromino {
    //     const tetrominoKeys = Object.keys(TETROMINOS);
    //     const firstTetrominoKey = tetrominoKeys[0];
    //     const firstTetromino = TETROMINOS[firstTetrominoKey];
    //     return firstTetromino;
    // }

    /**
     * Method to get a random tetromino
     * @returns Tetromino
     */
    getRandomTetromino(extended: boolean = true): Tetromino {
        const tetrominoKeys = Object.keys(TETROMINOS);
        if (extended) {
            console.log('extended');
            tetrominoKeys.push(...Object.keys(EXT_TETROMINOS));
        }
        const randomTetrominoKey = tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)];
        const randomTetromino = extended ? (TETROMINOS[randomTetrominoKey] || EXT_TETROMINOS[randomTetrominoKey]) : TETROMINOS[randomTetrominoKey];
        return randomTetromino;
    }

    /**
     * 
     * 
     * @param piece 
     */
    move(piece: Piece): void {
        this.clear();
        this.x = piece.x;
        this.y = piece.y;
        this.shape = piece.shape; // update matrix with new orientation
        this.render();
    }

    /**
     * Clear the piece from the board
     */
    clear() {
        // Clear only the area occupied by the piece
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx.clearRect(this.x + x, this.y + y, 1, 1);
                }
            });
        });
    }

    /**
     * Render the piece on the board
     */
    render() {
        this.ctx.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
                }
            });
        });
    }
}