import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { GameConfigService } from '../../services/game-config.service';
import { ScoreComponent } from '../../game-components/score.component';
import { LogoComponent } from '../../components/logo.component';
import { BoardNewComponent } from '../game/board-new.component';
import { BoardComponent } from '../../board/board.component';
import { PieceService } from '../../services/piece.service';
import { CommonModule } from '@angular/common';
import { GameConfig } from '../../defs';
import { NextPieceComponent } from '../game/next-piece.component';

@Component({
    selector: 'app-game',
    standalone: true,
    imports: [CommonModule, BoardComponent, ScoreComponent, LogoComponent, BoardNewComponent, NextPieceComponent],
    templateUrl: './game.component.html',
    styles: [
    ]
})
export class GameComponent {

    private gameConfig!: GameConfig;

    private configService = inject(GameConfigService);

    ngOnInit(): void {
        this.subscribeToConfig();
        // this.play();
    }

    /**
     * Subscribe to the configuration updates from the GameConfigService.
     * When the configuration changes, the callback function is triggered.
     */
    subscribeToConfig(): void {
        // Subscribe to the getConfigObservable() method of the GameConfigService
        this.configService.getConfigObservable().subscribe((config: GameConfig) => {
            this.gameConfig = config;
        });
    }

    // I have put a time out in because the board component is not ready when
    // the game component is initialised, this may be better in a service
    // play(): void {
    //     setTimeout(() => {
    //         // console.log("Play button clicked.");
    //         this.boardComponent.startGame();
    //     }, 500);
    // }

    // pause(): void {
    //     this.boardComponent.pauseGame();
    // }

    // rotate(): void {
    //     this.boardComponent.moveUp();
    // }
}
