import { TETROMINOS, EXT_TETROMINOS } from "./data";
import { Tetromino } from "./defs";

export class Piece {

    shape: number[][];
    color: string;
    x: number = 3; // starting x
    y: number = 0; // starting y

    private readonly RANDOM_TETROMINO: Tetromino;

    constructor(private ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        // TD!! need to update to accept game type
        this.RANDOM_TETROMINO = this.getRandomTetromino(false);
        // this.RANDOM_TETROMINO = this.getRandomTetromino(gameConfig.extended);
        this.color = this.RANDOM_TETROMINO.color;
        this.shape = this.RANDOM_TETROMINO.matrix;
    }

    /**
     * Get a random Tetromino object
     *
     * @param {boolean} extended - Whether to include extended Tetrominos
     * @returns {Tetromino} A randomly selected Tetromino object
     */
    getRandomTetromino(extended: boolean = false): Tetromino {
        const shapes = this.getGameShapes(extended);
        const shapeKeys = Object.keys(shapes);
        const randomIndex = Math.floor(Math.random() * shapeKeys.length);
        let randomShapeKey = shapeKeys[randomIndex];
        return shapes[randomShapeKey];
    }

    /**
     * Get the available Tetromino shapes based on the game mode
     *
     * @param {boolean} extended - Whether to include extended Tetrominos
     * @returns {Object.<string, Tetromino>} An object containing the available Tetromino shapes
     */
    private getGameShapes(extended: boolean): { [key: string]: Tetromino } {
        return extended ? { ...TETROMINOS, ...EXT_TETROMINOS } : { ...TETROMINOS };
    }

    /**
     * Move the piece, clear the canvas and render in the new position
     * @param piece - The piece containing the new position and shape.
     */
    move(piece: Piece): void {
        this.x = piece.x;
        this.y = piece.y;
        this.shape = piece.shape; // update matrix with new orientation
        this.clear();
        this.render();
    }

    /**
     * Clear the entire canvas (only clears the current piece)
     */
    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    }

    /**
     * Render the piece on the canvas
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



