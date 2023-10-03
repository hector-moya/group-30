import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { PieceService } from 'src/app/services/piece.service';
import { IConfig } from 'src/app/interfaces/Config';
import { CommonModule } from '@angular/common';
import { Canvas } from 'src/app/models/Canvas';
import { Piece } from 'src/app/models/Piece';

@Component({
    selector: 'app-next-piece',
    standalone: true,
    imports: [CommonModule],
    template: ` <canvas #canvas class="bdr bdr-green"></canvas> `
})
export class NextPieceComponent {

    @ViewChild('canvas', { static: true }) nextPieceRef!: ElementRef;
    @Input() config!: IConfig;

    ctx!: CanvasRenderingContext2D | null;
    private nextPiece!: Piece | null;

    /**
     * Component dependencies
     */
    private pieceService = inject(PieceService);

    ngOnInit(): void {
        this.initNextPiece();
        this.subscribeToNextPiece();
    }

    /**
     * Initialise the nextPiece canvas, set the rendering context, and obtain
     * the initial nextPiece from the PieceService.
     */
    private initNextPiece(): void {
        const { nextGridSize, blockSize } = this.config;
        const board = new Canvas(nextGridSize, nextGridSize, this.nextPieceRef.nativeElement, blockSize);
        this.ctx = board.getContext();
        this.nextPiece = this.getPiece();
    }

    /**
    * Set a new next Piece instance and clear the current one.
    * @throws {Error} Throws an error if there is a problem with the next piece.
    */
    setPiece() {
        if (!this.nextPiece) {
            throw new Error("There is a problem with next piece");
        }
        this.nextPiece.clear();
        this.nextPiece = this.getPiece();
    }

    /**
     * Get a new next Piece instance and notify subscribers
     * @returns {Piece} The next Piece
     */
    private getPiece(): Piece {
        return this.pieceService.getPiece(this.ctx!, 'next')
    }

    /**
     * Subscribe to the Piece updates from the PieceService which is
     * responsible for creating and moving the Piece.
     */
    private subscribeToNextPiece(): void {
        this.pieceService.observeNextPiece().subscribe((piece: Piece | null) => {
            this.nextPiece = piece;
        })
    }
}
