import { Component, ElementRef, HostListener, Input, ViewChild, inject } from '@angular/core';
import { AppLayout } from 'src/app/views/layouts/app-layout.component';
import { ModalComponent } from '../components/modal.component';
import { PieceService } from 'src/app/services/piece.service';
import { ModalService } from 'src/app/services/modal.service';
import { GameService } from 'src/app/services/game.service';
import { IPosition } from 'src/app/interfaces/Position';
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

    /**
     * Set an interval to move the piece down every. This is
     * cleared when the game is paused or the piece can no longer
     * move down.
     */
    private intervalId?: any;

    /**
     * The canvas context which gives access to the canvas API
     */
    ctx!: CanvasRenderingContext2D | null;

    /**
     * Local reference to the current Piece for rendering and easy access to
     * the current Piece.
     */
    private piece!: Piece | null;

    /**
     * Component dependencies
     */
    private pieceService = inject(PieceService);
    private modalService = inject(ModalService);
    private gameService = inject(GameService);

    ngOnInit(): void {
        this.subscribeToPiece();
        this.initBoard();
        this.subscribeToGrid();
        // this.startInterval();
    }

    /**
     * Initialise the game board and set the context. Then, get a Piece from
     * the PieceService and set to the piece property for for rendering and
     * easy access to the current Piece.
    */
    private initBoard(): void {
        const { rows, columns, blockSize: scale } = this.config;
        const board = new Canvas(columns, rows, this.boardRef.nativeElement, scale);
        this.ctx = board.getContext();
        // Retrieve the initial piece for rendering
        this.piece = this.pieceService.getPiece(this.ctx!, this.config.extended);
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

    /**
   * Subscribe to the grid updates from the GameService which is
   * responsible for rendering the grid.
   */
    private subscribeToGrid(): void {
        this.gameService.observeGrid().subscribe((grid: Matrix | null) => {
            this.gameService.renderGrid(this.ctx!);
        });
    }

    /**
     * Possible moves for the current Piece.
     *
     * These are called from the onKeydown event handler. The moves object
     * accepts the current Piece and uses a callback to return the updated
     * position in the selected direction or rotation.
     *
     */
    private moves: any = {
        ArrowLeft: (piece: Piece) => ({ ...piece, x: piece.x - 1 }),
        ArrowRight: (piece: Piece) => ({ ...piece, x: piece.x + 1 }),
        ArrowDown: (piece: Piece) => ({ ...piece, y: piece.y + 1 }),
        ArrowUp: (piece: Piece) => (this.pieceService.getRotatedPiece(piece)),
    };

    /**
     * Handle the keydown event and call the moves object, which accepts
     * the current piece and uses a callback to return the updated position
     * in the selected direction or rotation.
     */
    @HostListener('document:keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        if (this.moves[event.key]) {
            event.preventDefault();
            // decompose the updated piece into its shape, x, and y
            const { shape, x, y } = this.moves[event.key](this.piece);
            // if the piece can move to the new position
            if (this.gameService.canMove(shape, { x, y })) {
                this.moveAndRenderGrid(shape, { x, y });
            }
        }

        if (event.key === 'Escape') this.handleEscape();
    }

    handleEscape(): void {
        this.stopInterval();
        this.modalService.openModal('Do you want to end the game?');
    }

    /**
      * Start a periodic interval with a specified time interval. The time is
      * based on the level of the game. The higher the level, the faster the
      * interval.
      * @param {number} time The time interval in milliseconds
      */
    startInterval(time: number = 400) {
        if (!this.intervalId) {
            this.intervalId = setInterval(() => {
                this.drop();
            }, time);
        }
    }

    /**
     * Stop the periodic interval by clearing the interval ID
     */
    stopInterval() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined; // Reset the interval ID
        }
    }

    /**
     * Move the piece to the new position and render the grid
     * @param {Matrix} shape The shape of the piece
     * @param {IPosition} position The new position of the piece
     */
    private moveAndRenderGrid(shape: Matrix, position: IPosition): void {
        this.pieceService.move(shape, { x: position.x, y: position.y });
        this.gameService.renderGrid(this.ctx!);
    }

    /**
     * Drop the piece down one row if it can move. If it can't move, lock the
     * piece in place.
     */
    private drop(): void {
        const { shape, x, y } = this.moves["ArrowDown"](this.piece);
        if (this.gameService.canMove(shape, { x, y })) {
            this.moveAndRenderGrid(shape, { x, y });
        } else {
            // make sure you pass in the 'current' position to be locked in!
            this.gameService.lock(shape, { x: this.piece?.x || 0, y: this.piece?.y || 0 });
            this.piece = this.pieceService.getPiece(this.ctx!, this.config.extended, 'current');
            // this is jittery, but it works. The new piece and clearing of
            // rows needs to happen at the same time
            this.gameService.clearRows();
        }
    }
}
