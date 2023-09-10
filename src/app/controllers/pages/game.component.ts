import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { ScoreComponent } from '../../game-components/score.component';
import { NextPieceComponent } from '../game/next-piece.component';
import { LogoComponent } from '../components/logo.component';
import { BoardComponent } from '../game/board.component';
import { CommonModule } from '@angular/common';
import { IConfig } from 'src/app/models/Config';

@Component({
    selector: 'app-game',
    standalone: true,
    imports: [CommonModule, ScoreComponent, LogoComponent, BoardComponent, NextPieceComponent],
    templateUrl: './game.component.html',
    styles: [
    ]
})
export class GameComponent {

    public config!: IConfig;

    private configService = inject(ConfigService);

    ngOnInit(): void {
        this.subscribeToConfig();
    }

    /**
     * Subscribe to the configuration updates from the ConfigService.
     * When the configuration changes, the callback function is triggered.
     */
    subscribeToConfig(): void {
        this.configService.getConfigObservable().subscribe((config: IConfig) => {
            this.config = config;
        });
    }
}



// I have put a time out in because the board component is not ready when
// the game component is initialised, this may be better in a service
// play(): void {
//     setTimeout(() => {
//         this.boardComponent.startGame();
//     }, 500);
// }

// pause(): void {
//     this.boardComponent.pauseGame();
// }

// rotate(): void {
//     this.boardComponent.moveUp();
// }
