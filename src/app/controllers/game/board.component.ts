import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, inject } from '@angular/core';
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

    /**
     * Emit event to tell the NextPieceComponent to create a new piece
     */
    @Output() newNextPieceEvent = new EventEmitter<string>();

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
     * Flag to indicate if the game has started. This is used to prevent
     * certain behaviours when the game is paused or stopped.
     */
    gameStarted: Boolean = true;

    /**
     * Component dependencies
     */
    private pieceService = inject(PieceService);
    private modalService = inject(ModalService);
    private gameService = inject(GameService);

    devData: any = {}; // NK::TD can remove

    ngDoCheck(): void {
        this.setDevData();
    }

    // ngOnDestroy(): void {
    //     console.log('Component destroyed');
    // }

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
        if (this.gameStarted) {
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

        if (event.key === 'P' || event.key === 'p') {
            event.preventDefault();
            this.intervalId ? this.cancelAnimation() : this.startAnimation();

            if (!this.ctx) throw new Error('The canvas context is null');
            this.gameService.pauseMessage(this.ctx);
        }
    }

    /**
     * Handle the escape key event by pausing the game and opening the modal
     */
    handleEscape(): void {
        this.cancelAnimation();

        this.modalService.openModal({
            title: 'Do you want to end the game?',
            buttons: [
                { label: 'Continue Game', class: '', action: 'close' },
                { label: 'Return to Start', class: 'primary', action: 'redirect' },
            ]
        }, (action?: string) => {
            if (action === 'cancel' || action === 'close') {
                this.startAnimation();
            }
        });
    }

    /**
    * Handle the game over event by resetting the game and displaying the
    * game over message/high score modal.
    */
    handleGameOver() {

        this.cancelAnimation();
        alert('Game Over');

        // if (this.scoreService.isTopScore(this.scoreService.getScore())) {
        //     this.modalType = 'highScore';
        //     var title = 'New High Score';
        //     var buttons = [{ label: 'Continue', class: 'primary', action: 'setScore' }]
        // } else {
        //     this.modalType = '';
        //     var title = 'Game Over';
        //     var buttons = [
        //         { label: 'Return Home', class: '', action: 'redirect' },
        //         { label: 'Play Again', class: 'primary', action: 'close' },
        //     ]
        // }

        // this.modalService.openModal({ title, buttons, },
        //     (action?: string) => {
        //         this.scoreService.addHighScore(this.playerName, this.scoreService.getScore());

        //         // display the high scores modal when the input closes
        //         if (action === 'displayHighScores') {
        //             this.modalType = 'displayHighScores';
        //             this.modalService.openModal({
        //                 title: 'Top 10 High Scores',
        //                 buttons: [{ label: 'Close', class: 'primary', action: 'close' },]
        //             });
        //         }

        //         if (action === 'close') {
        //             this.reload();
        //         }
        //     });
    }

    /**
      * Start a periodic interval with a specified time interval. The time is
      * based on the level of the game. The higher the level, the faster the
      * interval.
      * @param {number} time The time interval in milliseconds
      */
    startAnimation(time: number = 300) {
        this.gameStarted = true;
        if (!this.intervalId) {
            this.intervalId = setInterval(() => {
                if (!this.drop()) {
                    this.handleGameOver();
                    return;
                }
            }, time);
        }
    }

    /**
     * Stop the periodic interval by clearing the interval ID
     */
    cancelAnimation() {
        this.gameStarted = false;
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
     * @returns {boolean} Returns true if the piece can move down, false if it cannot
     */
    private drop(): boolean {
        if (!this.ctx) throw new Error('The canvas context is null in the board component')

        const { shape, x, y } = this.moves["ArrowDown"](this.piece);
        if (this.gameService.canMove(shape, { x, y })) {
            this.moveAndRenderGrid(shape, { x, y });
        } else {
            // make sure you pass in the 'current' position to be locked in!
            this.gameService.lock(shape, { x: this.piece?.x || 0, y: this.piece?.y || 0 });
            this.gameService.clearRows();


            if (this.piece!.y === 0) {
                return false;
            }

            // the order matters to prevent lag when clearing and re-rendering
            this.piece!.clear(); // for clear to prevent lag
            this.pieceService.swapNextToCurrent(this.ctx);
            this.gameService.renderGrid(this.ctx);
            this.newNextPieceEvent.emit();
        }
        return true;
    }

    /**
    * Set data for development purposes
    */
    setDevData(): void {
        // this.devData.score = this.scoreService.getScore();
        // this.devData.isHighScore = this.scoreService.isTopScore(this.scoreService.getScore());
        this.devData.pieceY = this.piece!.y;
        this.devData.gameStarted = this.gameStarted;
    }

    test() {
        this.resetGrid();
    }

    resetGrid() {
        // this.gameService.resetGrid(this.ctx!);
        this.gameService.initGrid(this.ctx!);
    }
}
