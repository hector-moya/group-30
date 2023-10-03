import { IPosition } from "../interfaces/Position";
import { IConfig } from "../interfaces/Config";
import { IPiece } from "../interfaces/Piece";
import { Matrix } from "../defs";

export class Piece implements IPiece {

    public x: number;
    public y: number = 0;

    constructor(
        private ctx: CanvasRenderingContext2D,
        public shape: Matrix,
        public color: string,
        private config: IConfig,
        public type: string = 'current'
    ) {
        this.x = this.centerXPosition(this.shape);
        this.render();
    }

    /**
     * Move the piece, clear the canvas and render in the new position
     * @param {IMatrix} shape the updated piece shape
     * @param {IPosition} position the updated piece position
     */
    move(shape: Matrix, position: IPosition): void {
        this.x = position.x;
        this.y = position.y;
        this.shape = shape;
        this.clear();
        this.render();
    }

    /**
     * Clear the entire canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    }

    /**
     * Render the piece on the canvas
     */
    render() {
        this.ctx!.fillStyle = this.color;
        this.shape.forEach((row, rowIndex) => {
            // tetVal represents the tetromino value. I=1, J=2, ... Z=7
            row.forEach((tetVal, columnIndex) => {
                if (tetVal > 0) {
                    const x = this.x + columnIndex;
                    const y = this.y + rowIndex;
                    this.ctx!.fillRect(x, y, 1, 1);
                }
            });
        });
    }

    /**
     * Calculate the center x position of a shape
     * @param {Matrix} shape - The shape to be checked
     * @returns {number} The center x position of the shape
     */
    centerXPosition(shape: Matrix): number {
        const columns = this.type === 'next'
            ? this.config.nextGridSize
            : this.config.columns;
        return Math.floor((columns! - this.calculateMaxWidth(shape)) / 2);
    }

    /**
     * Helper function to calculate the maximum width of a shape
     * @param {Matrix} shape - The shape to be checked
     * @returns {number} The maximum width of the shape
     */
    calculateMaxWidth(shape: Matrix): number {
        let maxWidth = 0;

        for (let row = 0; row < shape.length; row++) {
            let rowWidth = 0;

            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] > 0) {
                    rowWidth = col + 1; // Increment the row width when a non-zero value is encountered
                }
            }

            if (rowWidth > maxWidth) {
                maxWidth = rowWidth; // Update the maximum width if the current row width is greater
            }
        }

        return maxWidth;
    }

}
