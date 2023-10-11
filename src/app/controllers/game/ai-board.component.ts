import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, inject } from '@angular/core';
import { AppLayout } from 'src/app/views/layouts/app-layout.component';
import { LoggerService } from 'src/app/services/logger.service';
import { ModalComponent } from '../components/modal.component';
import { PieceService } from 'src/app/services/piece.service';
import { ScoreService } from 'src/app/services/score.service';
import { ModalService } from 'src/app/services/modal.service';
import { GameService } from 'src/app/services/game.service';
import { HighScoreComponent } from './high-score.component';
import { IPosition } from 'src/app/interfaces/Position';
import { IGameStats } from 'src/app/interfaces/Score';
import { IConfig } from 'src/app/interfaces/Config';
import { CommonModule } from '@angular/common';
import { Canvas } from 'src/app/models/Canvas';
import { Piece } from 'src/app/models/Piece';
import { FormsModule } from '@angular/forms';
import { Matrix } from 'src/app/defs';
import { ENV } from 'src/app/env';

@Component({
    selector: 'app-ai-board',
    standalone: true,
    imports: [CommonModule, AppLayout, ModalComponent, HighScoreComponent, FormsModule],
    templateUrl: '../../views/game/ai-board.component.html',
})
export class AiBoardComponent {

    @ViewChild('canvas', { static: true }) boardRef!: ElementRef;
    @Input() config!: IConfig;

    /**
     * Emit event to tell the NextPieceComponent to create a new piece
     */
    @Output() newNextPieceEvent = new EventEmitter<string>();

    modalType: string = '';
    playerName: string = 'Player 1';
    devMode: boolean = ENV.DEV_MODE;

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

    /**
     * Component dependencies
     */
    private loggerService = inject(LoggerService);
    private pieceService = inject(PieceService);
    private modalService = inject(ModalService);
    private gameService = inject(GameService);
    private scoreService = inject(ScoreService);

    devData: any = {}; // NK::TD can remove

    ngDoCheck(): void {
        this.setDevData();
    }

    ngOnInit(): void {
        this.initBoard();
        this.initGameStats();
        // Delay animation start to prevent the piece dropping too quickly
        setTimeout(() => {
            this.animate();
        }, 500);
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
        try {
            const board = new Canvas(columns, rows, this.boardRef.nativeElement, scale);
            this.ctx = board.getContext();
        } catch (error) {
            console.error('Error initializing canvas context:', error);
            this.loggerService.log(`Error initializing canvas context: ${error}`);
        }
        if (!this.ctx) throw new Error('The canvas context is null');
        this.piece = this.pieceService.getPiece(this.ctx);
        this.gameService.initGrid(this.ctx);
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

        this.modalType = 'endGame';
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

        const isHighScore = this.scoreService.isTopScore(this.scoreService.getScore());

        if (isHighScore) {
            this.modalType = 'highScore';
            var title = 'New High Score';
            this.scoreService.addHighScore('AI', this.scoreService.getScore());
        } else {
            var title = `Game Over`;
        }

        this.modalService.openModal({
            title, buttons: [
                { label: 'Return Home', class: '', action: 'redirect' },
                { label: 'Restart Demo', class: 'primary', action: 'playAgain' },
            ],
        },
            (action?: string) => {
                if (action === 'playAgain') this.reload();
            })
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
        try {
            this.gameStarted = true;
            if (!this.time) throw new Error('The time object is null');
            this.time.elapsed = now - this.time.start;
            if (this.time.elapsed > this.time.speed) {
                this.time.start = now;
                if (!this.drop()) {
                    this.handleGameOver();
                    return;
                }
            }
            this.requestId = requestAnimationFrame(this.animate.bind(this));
        } catch (error) {
            console.error('Error during animation:', error);
            this.loggerService.log(`Error during animation: ${error}`);
        }
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
        if (this.ctx) {
            this.pieceService.move(shape, { x: position.x, y: position.y });
            this.gameService.renderGrid(this.ctx);
        } else {
            console.error('Canvas context is null, cannot render grid.');
            this.loggerService.log('Canvas context is null, cannot render grid.');
        }
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
        this.devData.gameStarted = this.gameStarted;
        this.devData.pieceY = this.piece!.y;
        this.devData.config = this.config;
        // this.devData.time = this.time;
        this.devData.gameStats = this.gameStats;
        this.devData.speed = this.time?.speed;
        this.devData.isHighScore = this.scoreService.isTopScore(this.scoreService.getScore());
    }

    test() {
        // this.loggerService.log('test');
    }

    resetGrid() {
        this.gameService.initGrid(this.ctx!);
    }
}
