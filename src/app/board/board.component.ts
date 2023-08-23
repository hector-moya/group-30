import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { GameConfigService } from '../services/game-config.service';
import { CommonModule } from '@angular/common';
import { GameConfig } from '../defs';
import { Piece } from '../models/Piece';
import { PieceService } from '../services/piece.service';

@Component({
    selector: 'app-board',
    standalone: true,
    imports: [CommonModule],
    template: `
    <canvas #board class="bdr-red bdr-3"></canvas>
    <div class="grid cols-2 mt">
        <button (click)="moveLeft()" class="btn blue">Left</button>
        <button (click)="moveRight()" class="btn blue">Right</button>
        <button (click)="moveDown()" class="btn blue">Down</button>
        <button class="btn blue" disabled>Rotate</button>
    </div>
    `,
    styles: []
})

export class BoardComponent implements OnInit {

    @ViewChild('board', { static: true }) board!: ElementRef<HTMLCanvasElement>;

    private ctx: CanvasRenderingContext2D | null = null;
    private gameConfig!: GameConfig;

    private configService = inject(GameConfigService);
    private pieceService = inject(PieceService);

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

    getCurrentPiece(): void {
        this.currentPiece = this.pieceService.getPiece(this.ctx!);
        this.pieceService.setCurrentPiece(this.currentPiece!);
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
