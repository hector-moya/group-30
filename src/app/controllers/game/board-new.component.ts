import { Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import { GameConfigService } from 'src/app/services/game-config.service';
import { AppLayout } from 'src/app/views/layouts/app-layout.component';
import { PieceService } from 'src/app/services/piece.service';
import { ModalService } from 'src/app/services/modal.service';
import { IConfig } from 'src/app/models/GameConfig';
import { CommonModule } from '@angular/common';
import { Canvas } from 'src/app/models/Canvas';
import { Piece } from 'src/app/models/Piece';

@Component({
    selector: 'app-board-new',
    standalone: true,
    imports: [CommonModule, AppLayout],
    template: `<canvas #canvas class="bdr bdr-red"></canvas>`,
})
export class BoardNewComponent {

    @ViewChild('canvas', { static: true }) boardRef!: ElementRef;

    ctx!: CanvasRenderingContext2D | null;
    private currentPiece!: Piece | null;

    private configService = inject(GameConfigService);
    private pieceService = inject(PieceService);
    private modalService = inject(ModalService);

    ngOnInit(): void {
        this.initGameBoard();
        this.subscribeToPiece();
    }

    /**
     * Subscribe to the configuration updates from the ConfigService and
     * initialize the game board.
     */
    private initGameBoard(): void {
        this.configService.getConfigObservable().subscribe((config: IConfig) => {
            // Instantiate the game board and set the context
            const { rows, columns, blockSize } = config
            const board = new Canvas(columns, rows, this.boardRef.nativeElement, blockSize);
            this.ctx = board.getContext();
            this.getPiece();
        });
    }

    /**
     * Get a Piece from the PieceService and set it to the currentPiece
     * property. Then, run the setCurrentPiece() method of the PieceService
     * which will notify the subscribers of the current Piece.
     */
    private getPiece(): void {
        this.currentPiece = this.pieceService.getPiece(this.ctx!);
        this.pieceService.setCurrentPiece(this.currentPiece);
    }

    /**
     * Subscribe to the Piece updates from the PieceService which is
     * responsible for creating and moving the Piece.
     */
    private subscribeToPiece(): void {
        this.pieceService.getPieceObservable().subscribe((piece: Piece | null) => {
            this.currentPiece = piece;
        })
    }

    /**
     *
     *
     *
     *
     * REVIEW AN WOVE THIS
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     */


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
        event.preventDefault();
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

    handleEscape(): void {
        this.modalService.openModal('Do you want to end the game?');
    }
}
