import { GameConfig, Tetromino } from "../defs";

export class Piece {

    private shape: number[][];
    private color: string;
    public x: number = 3; // start at middle
    public y: number = 0; // start at top

    private gameConfig!: GameConfig;
    private stepInterval: ReturnType<typeof setInterval> | undefined;
    private bottomCollision: boolean = false; //Add a flag to check if the piece has bottom collision, this is temporary and will be removed ones we implement the grid.

    constructor(private ctx: CanvasRenderingContext2D, tetromino: Tetromino, gameConfig: GameConfig, isNextPiece: boolean = false) {
        this.ctx = ctx;
        this.shape = tetromino.matrix;
        this.color = tetromino.color;
        this.gameConfig = gameConfig;

        // If the piece is the next piece, start at middle of the next piece board
        if (isNextPiece) {
            this.x = 1;
            this.y = 1;
        }
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

    startInterval(time: number = 1000) {
        if (!this.stepInterval) {
            this.stepInterval = setInterval(() => {
                console.log('moving down');
                this.move('down');
            }, time);
        }
    }

    stopInterval() {
        if (this.stepInterval) {
            clearInterval(this.stepInterval);
            this.stepInterval = undefined; // Reset the interval ID
        }
    }

    move(direction: 'left' | 'right' | 'down' | 'rotate'): void {
        if (this.bottomCollision) return; // If the piece has bottom collision, do not allow further movement.
        let xOffset = 0;
        let yOffset = 0;

        switch (direction) {
            case 'left':
                xOffset = -1;
                break;
            case 'right':
                xOffset = 1;
                break;
            case 'down':
                yOffset = 1;
                break;
            case 'rotate':
                this.rotate();
                return;
        }
        if (this.canMove(this, xOffset, yOffset)) {
            this.x += xOffset;
            this.y += yOffset;
            this.clear();
            this.render();
        } else if (direction === 'down') {
            // If the piece is unable to move down, it means it has bottom collision and should not move further
            this.bottomCollision = true;
            this.stopInterval(); // Stop the interval

        }
    }

    /**
     * Rotate the piece clockwise as long as there is no collision
     * 
     * @returns {void}
     */
    private rotate(): void {
        // Create a temporary copy of the shape
        const tempShape = this.shape.map(row => row.slice());
    
        // Transpose the temporary matrix (rotate 90 degrees)
        for (let y = 0; y < tempShape.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [tempShape[x][y], tempShape[y][x]] = [tempShape[y][x], tempShape[x][y]];
            }
        }
    
        // Reverse each row of the temporary matrix
        tempShape.forEach(row => row.reverse());
    
        // Check if the rotated shape is within the boundary
        if (this.isRotationAllowed(tempShape)) {
            // Update the actual shape with the rotated version
            this.shape = tempShape;
            
            // Re-render the piece
            this.clear();
            this.render();
        }
    }

    /**
     * Determine if a tetromino is allowed to move
     *
     * @param {Piece} piece The tetromino object to be checked.
     * @returns {boolean} The movable state
     */
    private canMove(piece: Piece, xOffset: number, yOffset: number): boolean {
        // `matrix.every` checks if every row of the shape meets the conditions
        return piece.shape.every((row, rowIndex) => {
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
     * Clear the entire canvas (only clears the current piece)
     */
    private clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
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
        return x >= 0
            && x < this.gameConfig.columns
            && y < this.gameConfig.rows;
    }


    /**
     * Check if the rotated shape is within the boundary and does not collide with other pieces
     * Return a boolean value indicating whether the rotation is allowed
     * 
     * @param rotatedShape 
     * @returns 
     */
    private isRotationAllowed(rotatedShape: number[][]): boolean {
        // Check if every cell of the rotated shape meets the conditions
        return rotatedShape.every((row, rowIndex) => {
            return row.every((value, columnIndex) => {
                let x = this.x + columnIndex;
                let y = this.y + rowIndex;
    
                return value === 0 || this.isInBoundary(x, y);
            });
        });
    }

}
