import { Piece } from "./Piece";

export class Board {
    
    piece: Piece;

    constructor(public ctx: CanvasRenderingContext2D) {
        this.piece = new Piece(ctx);
    }
}