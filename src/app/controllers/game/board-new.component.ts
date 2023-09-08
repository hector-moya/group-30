import { AppLayout } from 'src/app/views/layouts/app-layout.component';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Canvas } from 'src/app/models/Canvas';
import { Piece } from 'src/app/models/Piece';
import { PieceService } from 'src/app/services/piece.service';

@Component({
    selector: 'app-board-new',
    standalone: true,
    imports: [CommonModule, AppLayout],
    template: `<canvas #canvas class="bdr bdr-red"></canvas>`,
})
export class BoardNewComponent {

    @ViewChild('canvas', { static: true }) boardRef!: ElementRef;

    board?: Canvas;
    ctx: CanvasRenderingContext2D | null = null;
    private pieceService = inject(PieceService);
    private currentPiece: Piece | null = null;

    ngOnInit(): void {
        this.init();
        this.getPiece();
    }

    init(): void {
        this.board = new Canvas(10, 5, this.boardRef.nativeElement, 30);
        this.ctx = this.board.getContext();
    }

    getPiece(): void {
        this.currentPiece = this.pieceService.getPiece(this.ctx!);
    }
    
    /**
     * Subscribe to the Piece updates from the PieceService.
     * When the Piece changes, the callback function is triggered.
     * This is where we will render the Piece.
     *
     */
    subscribeToPiece(): void {
        this.pieceService.getPieceObservable().subscribe((piece: Piece | null) => {
            this.currentPiece = piece;
        })
    }

}
