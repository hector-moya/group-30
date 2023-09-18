import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { NextPieceComponent } from '../game/next-piece.component';
import { ConfigService } from '../../services/config.service';
import { LogoComponent } from '../components/logo.component';
import { BoardComponent } from '../game/board.component';
import { ScoreComponent } from '../game/score.component';
import { IConfig } from 'src/app/interfaces/Config';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';

@Component({
    selector: 'app-game',
    standalone: true,
    imports: [CommonModule, LogoComponent, BoardComponent, NextPieceComponent, ScoreComponent],
    templateUrl: '../../views/pages/game.component.html',
    styles: [
    ]
})
export class GameComponent {

    public config!: IConfig;

    private configService = inject(ConfigService);
    private gameService = inject(GameService);

    ngOnInit(): void {
        this.subscribeToConfig();
    }

    /**
     * Subscribe to the configuration updates from the ConfigService.
     * When the configuration changes, the callback function is triggered.
     */
    subscribeToConfig(): void {
        this.configService.observeConfig().subscribe((config: IConfig) => {
            this.config = config;
        });
    }

    play(): void {
        this.gameService.play();
    }
}
