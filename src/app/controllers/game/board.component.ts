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
import { IGameStats } from 'src/app/interfaces/Score';
import { ScoreService } from 'src/app/services/score.service';

@Component({
    selector: 'app-board',
    standalone: true,
    imports: [CommonModule, AppLayout, ModalComponent, HighScoreComponent, FormsModule],
    template: `
        <canvas #canvas class="bdr bdr-red"></canvas>
        <div class="flex space-x mt w-16">
            <button (click)="test()" class="btn">Test</button>
            <button (click)="reload()" class="btn dark">Reload</button>
            <!-- <button (click)="resetGame()" class="btn dark">Reset</button> -->
            <button (click)="handleGameOver()" class="btn dark">Game Over</button>
        </div>

        <pre class="pxy-05"><small>{{ devData | json }}</small></pre>

        <modal>
            <ng-container *ngIf="modalType === 'highScore'">
                <div class="frm-row">
                    <input [(ngModel)]="playerName" name="name" placeholder="Enter your name..." required>
                    <!-- <input [(ngModel)]="playerName" name="name" placeholder="Enter your name..." required minlength="4" appForbiddenName="bob" #nameInput="ngModel"> -->
                    <!-- <div *ngIf="nameInput.invalid && (nameInput.dirty || nameInput.touched)" class="alert">
                        <div *ngIf="nameInput.errors?.['required']"> Name is required. </div>
                        <div *ngIf="nameInput.errors?.['minlength']"> Name must be at least 4 characters long. </div>
                        <div *ngIf="nameInput.errors?.['forbiddenName']"> Name cannot be Bob. </div>
                    </div> -->
                </div>
            </ng-container>
            <ng-container *ngIf="modalType === 'saveAndDisplayHighScore'">
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
    playerName: string = 'Player 1';

    /**
     * Set an interval to move the piece down every. This is
     * cleared when the game is paused or the piece can no longer
     * move down.
     */
    private requestId?: any;

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
     * Game state and scoring variables
     */
    time?: { start: number, elapsed: number, speed: number };
    gameStarted: Boolean = true;
    gameStats?: IGameStats;
    // dropSpeed?: number;

    /**
     * Component dependencies
     */
    private pieceService = inject(PieceService);
    private modalService = inject(ModalService);
    private gameService = inject(GameService);
    private scoreService = inject(ScoreService);

    devData: any = {}; // NK::TD can remove

    ngDoCheck(): void {
        this.setDevData();
    }

    // ngOnDestroy(): void {
    //     console.log('Component destroyed');
    // }

    ngOnInit(): void {
        this.initBoard();
        this.initGameStats();
        this.animate();

        // this may not be necessary but it is good for debugging
        this.scoreService.observeScore().subscribe((gameStats: IGameStats) => {
            this.gameStats = gameStats;
        });
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
     * Initialise the game stats and set the initial drop speed.
     */
    initGameStats() {
        const startingValues: IGameStats = { score: 0, lines: 0, level: this.config.startLevel, levelUp: 1 };
        this.scoreService.setGameStats(startingValues); // set the initial game stats in the score service
        this.time = { start: 0, elapsed: 0, speed: this.scoreService.getLevelSpeed() };
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
            this.requestId ? this.stopAnimation() : this.animate();

            if (!this.ctx) throw new Error('The canvas context is null');
            this.gameService.pauseMessage(this.ctx);
        }
    }

    /**
     * Handle the escape key event by pausing the game and opening the modal
     */
    handleEscape(): void {
        this.stopAnimation();

        this.modalService.openModal({
            title: 'Do you want to end the game?',
            buttons: [
                { label: 'Continue Game', class: '', action: 'close' },
                { label: 'Return to Start', class: 'primary', action: 'redirect' },
            ]
        }, (action?: string) => {
            if (action === 'cancel' || action === 'close') {
                this.animate();
            }
        });
    }

    /**
    * Handle the game over event by resetting the game and displaying the
    * game over message/high score modal.
    */
    handleGameOver() {

        this.stopAnimation();

        const playHomeButtons = [
            { label: 'Return Home', class: '', action: 'redirect' },
            { label: 'Play Again', class: 'primary', action: 'playAgain' },
        ]

        if (this.scoreService.isTopScore(this.scoreService.getScore())) {
            this.modalType = 'highScore';
            var title = 'New High Score';
            var buttons = [{ label: 'Continue', class: 'primary', action: 'saveAndDisplayHighScore' }]
        } else {
            this.modalType = '';
            var title = 'Game Over';
            var buttons = playHomeButtons
        }

        this.modalService.openModal({ title, buttons, },
            (action?: string) => {
                this.scoreService.addHighScore(this.playerName, this.scoreService.getScore());
                // display the high scores modal when the input closes
                if (action === 'saveAndDisplayHighScore') {
                    this.modalType = 'saveAndDisplayHighScore';
                    this.modalService.openModal(
                        { title: 'Top 10 High Scores', buttons: playHomeButtons },
                        (action?: string) => {
                            if (action === 'playAgain') this.reload(); // replay the game
                        }
                    );
                }
                if (action === 'playAgain') this.reload(); // replay the game
            });
    }

    /**
     * Reset/start the game.
     * @returns {void}
     * @refactor This is the easiest way to reset the game, but it is not the
     * most efficient. It is better to reset the game by clearing the grid and
     * resetting the game stats.
     */
    reload(): void {
        window.location.reload();
    }

    /**
    * Animate method for managing the dropping piece using requestAnimationFrame.
    * @param {number} now The current timestamp provided by requestAnimationFrame.
    */
    private animate(now: number = 0): void {
        this.gameStarted = true;
        // Calculate the elapsed time since the animation started
        this.time!.elapsed = now - this.time!.start;
        // Check if the elapsed time exceeds the current level's time interval
        if (this.time!.elapsed > this.time!.speed) {
            // Reset the start time to the current time
            this.time!.start = now;
            // Call the "drop" method to move the piece down
            if (!this.drop()) {
                this.handleGameOver();
                return;
            }
        }
        // Request the next animation frame and bind it to the current instance of "this"
        this.requestId = requestAnimationFrame(this.animate.bind(this));
    }

    /**
     * Stop the periodic interval by clearing the interval ID
     */
    stopAnimation() {
        if (this.requestId) {
            cancelAnimationFrame(this.requestId);
            this.gameStarted = false;
            this.requestId = undefined;
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
            this.time!.speed = this.scoreService.getLevelSpeed();
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
        this.devData.time = this.time;
        this.devData.gameStats = this.gameStats;
        this.devData.gameStats = this.gameStats;
        this.devData.score = this.scoreService.getScore();
        this.devData.isHighScore = this.scoreService.isTopScore(this.scoreService.getScore());
    }

    test() {
        // this.resetGrid();
        this.modalService.openModal({
            title: 'Top 10 High Scores',
            buttons: [{ label: 'Close', class: 'primary', action: 'close' },]

        });
    }

    resetGrid() {
        // this.gameService.resetGrid(this.ctx!);
        this.gameService.initGrid(this.ctx!);
    }
}
