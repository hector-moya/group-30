import { AppLayout } from 'src/app/views/layouts/app-layout.component';
import { Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Canvas } from 'src/app/models/Canvas';
import { Piece } from 'src/app/models/Piece';
import { PieceService } from 'src/app/services/piece.service';
import { ModalService } from 'src/app/services/modal.service';


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
    private modalService = inject(ModalService);

    ngOnInit(): void {
        this.init();
        this.getPiece();
        this.pieceService.moveDown();

    }

    init(): void {
        this.board = new Canvas(10, 5, this.boardRef.nativeElement, 30);
        this.ctx = this.board.getContext();
    }

    getPiece(): void {
        this.currentPiece = this.pieceService.getPiece(this.ctx!);
        this.pieceService.setCurrentPiece(this.currentPiece); // Set the current piece in the service
    }

    moveLeft() {
        this.pieceService.moveLeft();
    }

    moveRight() {
        this.pieceService.moveRight();
    }

    moveDown() {
        this.pieceService.moveDown();
    }

    moveUp() {
        this.pieceService.moveUp();
    }

    startGame(): void {
        this.currentPiece?.startInterval(600);
    }

    pauseGame(): void {
        this.currentPiece?.stopInterval();
    }
    
    /**
     * Handle keyboard events
     * @param event
     */
    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent): void {
        switch (event.code) {
            case 'ArrowLeft':
                this.moveLeft();
                break;
            case 'ArrowRight':
                this.moveRight();
                break;
            case 'ArrowDown':
                this.moveDown();
                break;
            case 'ArrowUp':
                this.moveUp();
                break;
            case 'Escape':
                this.handleEscape();
                break;
        }
    }

    // this code will not live here
    handleEscape(): void {
        this.modalService.openModal('Do you want to end the game?');
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
