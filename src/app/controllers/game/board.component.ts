import { Component, ElementRef, HostListener, Input, ViewChild, inject } from '@angular/core';
import { AppLayout } from 'src/app/views/layouts/app-layout.component';
import { ModalComponent } from '../components/modal.component';
import { PieceService } from 'src/app/services/piece.service';
import { ModalService } from 'src/app/services/modal.service';
import { GameService } from 'src/app/services/game.service';
import { HighScoreComponent } from './high-score.component';
import { IPosition } from 'src/app/interfaces/Position';
import { IConfig } from 'src/app/interfaces/Config';
import { CommonModule } from '@angular/common';
import { Canvas } from 'src/app/models/Canvas';
import { Piece } from 'src/app/models/Piece';
import { FormsModule } from '@angular/forms';
import { Matrix } from 'src/app/defs';

@Component({
    selector: 'app-board',
    standalone: true,
    imports: [CommonModule, AppLayout, ModalComponent, HighScoreComponent, FormsModule],
    template: `
        <canvas #canvas class="bdr bdr-red"></canvas>
        <div class="flex space-x mt">
            <button (click)="test()" class="btn">Test</button>
            <!-- <button (click)="reload()" class="btn dark">Reload</button> -->
            <!-- <button (click)="resetGame()" class="btn dark">Reset</button> -->
        </div>

        <pre class="pxy-05"><small>{{ devData | json }}</small></pre>

        <modal>
            <ng-container *ngIf="modalType === 'highScore'">
                <div class="frm-row">
                    <input [(ngModel)]="playerName" id="name" name="name" placeholder="Enter your name...">
                </div>
            </ng-container>
            <ng-container *ngIf="modalType === 'displayHighScores'">
                <app-high-score></app-high-score>
            </ng-container>
        </modal>
    `,
})
export class BoardComponent {

    @ViewChild('canvas', { static: true }) boardRef!: ElementRef;
    @Input() config!: IConfig;

    modalType: string = '';
    playerName: string = '';

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

    devData: any = {}; // NK::TD remove

    ngOnInit(): void {
        this.initBoard();
        this.startAnimation();
    }

    /**
     * Initialise the game board, first piece, set the context and initialise
     * the empty grid.
     * @returns {void}
     */
    private initBoard(): void {
        const { rows, columns, blockSize: scale } = this.config;
        const board = new Canvas(columns, rows, this.boardRef.nativeElement, scale);
        this.ctx = board.getContext();
        // Retrieve the initial piece for rendering
        this.piece = this.pieceService.getPiece(this.ctx!);
        // Initialise the grid and render it to the canvas
        this.gameService.initGrid(this.ctx!);
    }

    /**
     * Possible moves for the current Piece.
     *
     * These are called from the onKeydown event handler. The moves object
     * accepts the current Piece and uses a callback to return the updated
     * position in the selected direction or rotation.
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

        // if (event.key === 'Escape') this.handleEscape();

        if (event.key === 'P' || event.key === 'p') {
            event.preventDefault();
            this.intervalId ? this.cancelAnimation() : this.startAnimation();

            if (!this.ctx) throw new Error('The canvas context is null');
            this.gameService.pauseMessage(this.ctx);
        }
    }


    /**
      * Start a periodic interval with a specified time interval. The time is
      * based on the level of the game. The higher the level, the faster the
      * interval.
      * @param {number} time The time interval in milliseconds
      */
    startAnimation(time: number = 1000) {
        if (!this.intervalId) {
            this.intervalId = setInterval(() => {
                this.drop();
                this.setDevData();
                // this.setDevData();
            }, time);
        }
    }

    /**
     * Stop the periodic interval by clearing the interval ID
     */
    cancelAnimation() {
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
            this.setDevData();
        } else {
            // make sure you pass in the 'current' position to be locked in!
            this.gameService.lock(shape, { x: this.piece?.x || 0, y: this.piece?.y || 0 });
            this.gameService.clearRows();

            // the order matters to prevent lag when clearing and re-rendering the piece
            this.piece!.clear(); // for clear to prevent lag
            this.piece = this.pieceService.getPiece(this.ctx!);
            this.gameService.renderGrid(this.ctx!);

            this.setDevData();

        }
    }

    /**
    * Set data for development purposes
    */
    setDevData(): void {
        // this.devData.score = this.scoreService.getScore();
        // this.devData.isHighScore = this.scoreService.isTopScore(this.scoreService.getScore());
        this.devData.pieceY = this.piece!.y;
    }

    test() {
        this.setDevData();
    }
}
