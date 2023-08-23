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
    template: `<canvas #board class="bdr-red bdr-3"></canvas>`,
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
        this.currentPiece = this.pieceService.getPiece(this.ctx!);
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
