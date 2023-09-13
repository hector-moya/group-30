import { Component, ElementRef, HostListener, Input, ViewChild, inject } from '@angular/core';
import { AppLayout } from 'src/app/views/layouts/app-layout.component';
import { ModalComponent } from '../components/modal.component';
import { PieceService } from 'src/app/services/piece.service';
import { ModalService } from 'src/app/services/modal.service';
import { IConfig } from 'src/app/interfaces/Config';
import { CommonModule } from '@angular/common';
import { Canvas } from 'src/app/models/Canvas';
import { Piece } from 'src/app/models/Piece';

@Component({
    selector: 'app-board',
    standalone: true,
    imports: [CommonModule, AppLayout, ModalComponent],
    template: `
        <canvas #canvas class="bdr bdr-red"></canvas>
        <modal [endGame]="true"></modal>
    `,
})
export class BoardComponent {

    @ViewChild('canvas', { static: true }) boardRef!: ElementRef;
    @Input() config!: IConfig;

    ctx!: CanvasRenderingContext2D | null;
    private piece!: Piece | null;

    private pieceService = inject(PieceService);
    private modalService = inject(ModalService);

    ngOnInit(): void {
        this.subscribeToPiece();
        this.initBoard();
    }

    /**
     * Initialise the game board and set the context. Then, get a Piece from
     * the PieceService and set it to the piece property.
    */
    private initBoard(): void {
        const { rows, columns, blockSize } = this.config;
        const board = new Canvas(columns, rows, this.boardRef.nativeElement, blockSize);
        this.ctx = board.getContext();
        this.getPiece();
    }

    /**
     * Get a Piece from the PieceService and set it to the piece
     * property. Then, run the setPiece() method of the PieceService
     * which will notify the subscribers of the current Piece.
     */
    private getPiece(): void {
        this.piece = this.pieceService.getPiece(this.ctx!, this.config.extended);
        this.pieceService.setPiece(this.piece);
    }

    /**
     * Subscribe to the Piece updates from the PieceService which is
     * responsible for creating and moving the Piece.
     */
    private subscribeToPiece(): void {
        this.pieceService.observePiece().subscribe((piece: Piece | null) => {
            this.piece = piece;
        })
    }

    private moves: any = {
        ArrowLeft: (piece: Piece) => ({ ...piece, x: piece.x - 1 }),
        ArrowRight: (piece: Piece) => ({ ...piece, x: piece.x + 1 }),
        ArrowDown: (piece: Piece) => ({ ...piece, y: piece.y + 1 }),
        // ArrowUp: (piece: Piece) => board.rotate(piece),
    };

    /**
     * Handle the keydown event and call the moves object, which accepts
     * the current piece and uses a callback to return the updated position
     * in the selected direction or rotation.
     */
    @HostListener('document:keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        if (this.moves[event.key]) {
            const updatedPiece = this.moves[event.key](this.currentPiece);
            const { matrix, x, y } = updatedPiece;
            const canMove = this.pieceService.canMove(matrix, { x, y });
            if (canMove) {
                this.pieceService.move(matrix, { x, y });
            }
        }

        if (event.key === 'Escape') this.handleEscape();
    }

    handleEscape(): void {
        this.modalService.openModal('Do you want to end the game?');
    }
}
