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
    template: `<canvas #canvas class="bdr bdr-red"></canvas>`,
    styles: [
    ]
})
export class NextPieceComponent {

    @ViewChild('canvas', { static: true }) nextPieceRef!: ElementRef;
    @Input() config!: IConfig;

    ctx!: CanvasRenderingContext2D | null;
    private nextPiece!: Piece | null;

    private pieceService = inject(PieceService);

    ngOnInit(): void {
        this.init();
        this.subscribeToNextPiece();
    }

    /**
      * Subscribe to the configuration updates from the ConfigService and
      * initialize the canvas.
      */
    private init(): void {
        const { nextGridSize, blockSize } = this.config;
        const board = new Canvas(nextGridSize, nextGridSize, this.nextPieceRef.nativeElement, blockSize);
        this.ctx = board.getContext();
        this.getPiece();
    }

    /**
     * Get a Piece from the PieceService and set it to the nextPiece
     * property. Then, run the setPiece() method of the PieceService
     * which will notify the subscribers of the current Piece.
     */
    private getPiece(): void {
        this.nextPiece = this.pieceService.getPiece(this.ctx!, this.config.extended, 'next');
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
