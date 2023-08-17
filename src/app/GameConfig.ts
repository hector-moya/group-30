import { Config } from "../defs.d";

export class GameConfig {

    private ctx: CanvasRenderingContext2D | null = null;

    constructor(public config: Config) {
        this.setupGameBoard();

    }

    /**
     * Sets up the canvas element and its rendering context.
     */
    setupGameBoard(): void {

        // Get the canvas element
        const canvas = document.querySelector<HTMLCanvasElement>('#board');

        // If the canvas element is not found, throw an error
        if (!canvas) {
            throw new Error("Canvas element not found.");
        } 

        // Get the rendering context
        this.ctx = canvas.getContext('2d');

        // If the rendering context is not found, throw an error else set the canvas width, height and scale
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
            throw new Error("Canvas rendering context not found.");
        }
        return this.ctx;
    }
}