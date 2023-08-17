import { Piece } from "./Piece";

export class Board {
    
    piece: Piece;

    constructor(public ctx: CanvasRenderingContext2D) {
        this.piece = new Piece(ctx);
    }

    /**
     * Rotate the piece clockwise
     * @param {Piece} piece - The piece to rotate
     */
    rotate(piece: Piece): Piece {

        const rotatedPiece = JSON.parse(JSON.stringify(piece));

        for (let y = 0; y < rotatedPiece.shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [rotatedPiece.shape[x][y], rotatedPiece.shape[y][x]] = [rotatedPiece.shape[y][x], rotatedPiece.shape[x][y]];
            }
        }

        rotatedPiece.shape.forEach((row: number[]) => row.reverse());

        return rotatedPiece;
    }

    /**
     * Check if the piece is out of bounds
     * @param {Piece} piece - The piece to check
     * @returns {boolean} Whether the piece is out of bounds
     */
    isPieceOutOfBounds(piece: Piece): boolean {
        return piece.shape.some((row: number[], dy: number) => {
            return row.some((value: number, dx: number) => {
                const x = piece.x + dx;
                const y = piece.y + dy;
                return value && (x < 0 || x >= 10 || y >= 20);
            });
        });
    }

}