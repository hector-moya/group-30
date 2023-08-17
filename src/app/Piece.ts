import { TETROMINOS, EXT_TETROMINOS, Tetromino } from "../defs";

export class Piece {

    shape: number[][];
    color: string;
    x: number = 3; // Initial x position
    y: number = 0; // Initial y position

    private readonly RandomTetromino: Tetromino;

    constructor(public ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.RandomTetromino = this.getTestromino();
        this.shape = this.RandomTetromino.matrix;
        this.color = this.RandomTetromino.color;
    }

    getTestromino(): Tetromino {
        const tetrominoKeys = Object.keys(TETROMINOS);
        const firstTetrominoKey = tetrominoKeys[0];
        const firstTetromino = TETROMINOS[firstTetrominoKey];
        return firstTetromino;
    }


    // /**
    //  * Get a random tetromino
    //  * @returns Tetromino
    //  */
    // getRandomTetromino(): Tetromino {
    //     const tetrominoes = Object.keys(TETROMINOS);
    //     const randomTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
    //     return TETROMINOS[randomTetromino];
    // }

    // /**
    //  * Get the available Tetromino shapes based on the game mode
    //  *
    //  * @param {boolean} extended - Whether to include extended Tetrominos
    //  * @returns {Object.<string, Tetromino>} An object containing the available Tetromino shapes
    //  */
    // private getGameShapes(extended: boolean): { [key: string]: Tetromino } {
    //     return extended ? { ...TETROMINOS, ...EXT_TETROMINOS } : { ...TETROMINOS };
    // }

    /**
     * 
     * 
     * @param piece 
     */
    move(piece: Piece): void {
        this.x = piece.x;
        this.y = piece.y;
        this.shape = piece.shape; // update matrix with new orientation
        this.clear();
        this.render();
    }

    /**
     * Clear the piece from the board
     */
    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
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