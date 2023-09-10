import { IDrawingContext } from "../interfaces/DrawingContext";

export class Canvas implements IDrawingContext {

    private ctx!: CanvasRenderingContext2D | null;

    constructor(
        public width: number = 0,
        public height: number = 0,
        public canvas: HTMLCanvasElement,
        public scale = 10
    ) {
        this.setContext();
    }

    private setContext(): void {
        this.ctx = this.canvas.getContext('2d');

        if (this.ctx) {
            this.ctx.canvas.width = this.width * this.scale;
            this.ctx.canvas.height = this.height * this.scale;
            this.ctx.scale(this.scale, this.scale);
        } else {
            throw new Error("Canvas context could not be obtained.");
        }
    }

    getContext(): CanvasRenderingContext2D | null {
        return this.ctx;
    }
}

