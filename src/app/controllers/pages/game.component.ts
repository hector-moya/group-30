import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { GameConfigService } from '../../services/game-config.service';
import { ScoreComponent } from '../../game-components/score.component';
import { LogoComponent } from '../../components/logo.component';
import { BoardNewComponent } from '../game/board-new.component';
import { BoardComponent } from '../../board/board.component';
import { PieceService } from '../../services/piece.service';
import { CommonModule } from '@angular/common';
import { Piece } from '../../models/Piece';
import { GameConfig } from '../../defs';

@Component({
    selector: 'app-game',
    standalone: true,
    imports: [CommonModule, BoardComponent, ScoreComponent, LogoComponent, BoardNewComponent],
    templateUrl: './game.component.html',
    styles: [
    ]
})
export class GameComponent {

    private gameConfig!: GameConfig;
    private ctxNext: CanvasRenderingContext2D | null = null;
    private nextPiece: Piece | null = null;

    @ViewChild(BoardComponent, { static: true }) boardComponent!: BoardComponent;
    @ViewChild('nextPieceBoard', { static: true }) nextPieceBoard!: ElementRef<HTMLCanvasElement>;

    private configService = inject(GameConfigService);
    private pieceService = inject(PieceService);

    ngOnInit(): void {
        this.subscribeToConfig();
        this.setupNextPieceBoard();
        this.getNextPiece();
        this.play();
    }

    /**
     * Subscribe to the configuration updates from the GameConfigService.
     * When the configuration changes, the callback function is triggered.
     */
    subscribeToConfig(): void {
        // Subscribe to the getConfigObservable() method of the GameConfigService
        this.configService.getConfigObservable().subscribe((config: GameConfig) => {
            this.gameConfig = config;
            this.setupNextPieceBoard();
        });
    }

    // I have put a time out in because the board component is not ready when
    // the game component is initialised, this may be better in a service
    play(): void {
        setTimeout(() => {
            // console.log("Play button clicked.");
            this.boardComponent.startGame();
        }, 500);
    }

    pause(): void {
        this.boardComponent.pauseGame();
    }

    rotate(): void {
        this.boardComponent.moveUp();
    }

    // Get the next piece
    getNextPiece(): void {
        this.nextPiece = this.pieceService.getNextPiece(this.ctxNext!);
        this.pieceService.setNextPiece(this.nextPiece); // Set the next piece in the service
    }

    setupNextPieceBoard(): void {

        // Get the canvas element from the template
        const canvas: HTMLCanvasElement = this.nextPieceBoard.nativeElement;

        if (!canvas) {
            throw new Error("Canvas element not found.");
        }
        // Get the 2D rendering context of the canvas
        this.ctxNext = canvas.getContext('2d');
        // Set the size of the canvas
        if (this.ctxNext) {
            this.ctxNext.canvas.width = 5 * this.gameConfig.blockSize;
            this.ctxNext.canvas.height = 5 * this.gameConfig.blockSize;
            this.ctxNext.scale(this.gameConfig.blockSize, this.gameConfig.blockSize);
        } else {
            throw new Error("There is something wrong with the Canvas class.");
        }
    }
}
