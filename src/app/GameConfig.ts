import { Config } from "../defs";

export class GameConfig {

    private ctx: CanvasRenderingContext2D | null = null;

    constructor(public config: Config) {
        this.setupGameBoard();
        // console.log(config);

    }

    /**
     * Sets up the canvas element and its rendering context.
     */
    setupGameBoard(): void {
        // Find the canvas element
        const canvas = document.querySelector<HTMLCanvasElement>('#board');

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

    /**
     * Get the canvas rendering context
     * @returns CanvasRenderingContext2D
     */
    getCanvasContext(): CanvasRenderingContext2D {
        if (!this.ctx) {
            throw new Error("Canvas context not found.");
        }
        return this.ctx;
    }
}