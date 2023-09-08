import { Component, ElementRef, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { GameConfigService } from '../services/game-config.service';
import { ModalComponent } from '../components/modal.component';
import { PieceService } from '../services/piece.service';
import { ModalService } from '../services/modal.service';
import { CommonModule } from '@angular/common';
import { Piece } from '../models/Piece';
import { GameConfig } from '../defs';

@Component({
    selector: 'app-board',
    standalone: true,
    imports: [CommonModule, ModalComponent],
    template: `
        <canvas #board class="bdr-red bdr-3"></canvas>
        <div class="grid cols-2 mt">
            <button (click)="moveLeft()" class="btn blue">Left</button>
            <button (click)="moveRight()" class="btn blue">Right</button>
            <button (click)="moveDown()" class="btn blue">Down</button>
            <button (click)="moveUp()"class="btn blue">Rotate</button>
        </div>

        <modal [endGame]="true"></modal>
    `,
    styles: []
})

export class BoardComponent implements OnInit {

    @ViewChild('board', { static: true }) board!: ElementRef<HTMLCanvasElement>;

    private ctx: CanvasRenderingContext2D | null = null;
    private gameConfig!: GameConfig;

    private configService = inject(GameConfigService);
    private pieceService = inject(PieceService);
    private modalService = inject(ModalService);

    private currentPiece: Piece | null = null;

    ngOnInit(): void {
        this.subscribeToConfig();
        this.getCurrentPiece();
        this.subscribeToPiece();
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

    getCurrentPiece(): void {
        this.currentPiece = this.pieceService.getPiece(this.ctx!);
        this.pieceService.setCurrentPiece(this.currentPiece); // Set the current piece in the service
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
     * Subscribe to the configuration updates from the GameConfigService.
     * When the configuration changes, the callback function is triggered.
     */
    subscribeToConfig(): void {
        // Subscribe to the getConfigObservable() method of the GameConfigService
        this.configService.getConfigObservable().subscribe((config: GameConfig) => {
            this.gameConfig = config;
            this.setupGameBoard();
        });
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

    /**
     * Set up the canvas element and its rendering context.
     */
    setupGameBoard(): void {

        // Find the canvas element
        const canvas: HTMLCanvasElement = this.board.nativeElement;

        // Check if the canvas element exists
        if (!canvas) {
            throw new Error("Canvas element not found.");
        }

        // Get the 2D rendering context of the canvas
        this.ctx = canvas.getContext('2d');

        // If the context is available, configure the canvas properties
        if (this.ctx) {
            this.ctx.canvas.width = this.gameConfig.columns * this.gameConfig.blockSize;
            this.ctx.canvas.height = this.gameConfig.rows * this.gameConfig.blockSize;
            this.ctx.scale(this.gameConfig.blockSize, this.gameConfig.blockSize);
        } else {
            throw new Error("There is something wrong with the Canvas class.");
        }
    }

}
