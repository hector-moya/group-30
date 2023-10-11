import { NextPieceComponent } from '../game/next-piece.component';
import { ConfigService } from '../../services/config.service';
import { AiBoardComponent } from '../game/ai-board.component';
import { LogoComponent } from '../components/logo.component';
import { BoardComponent } from '../game/board.component';
import { ScoreComponent } from '../game/score.component';
import { IConfig } from 'src/app/interfaces/Config';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-game',
    standalone: true,
    imports: [CommonModule, LogoComponent, BoardComponent, NextPieceComponent, ScoreComponent, AiBoardComponent],
    templateUrl: '../../views/pages/game.component.html'
})
export class GameComponent {

    /**
     * Component dependencies
     */
    private configService = inject(ConfigService);

    config!: IConfig;
    hasSound!: boolean;
    gameType!: string;

    private gamePlayMusic: HTMLAudioElement | null = new Audio('/assets/music/game_music.mp3');

    constructor(private route: ActivatedRoute) {
        this.route.data.subscribe(data => {
            this.gameType = data['gameType'];
        });
    }

    ngOnInit(): void {
        this.gamePlayMusic!.loop = true;

        this.configService.observeConfig().subscribe((config: IConfig) => {
            this.config = config;
            this.hasSound = config.hasSound!;
            this.playMusic();
        });
    }

    /**
     * Toggle the music and sound on and off
     */
    toggleSound() {
        this.configService.toggleSound();
    }

    /**
     * Play the title music
     */
    playMusic(): void {
        if (this.hasSound) {
            this.gamePlayMusic!.muted = false; // Unmute the audio
            this.gamePlayMusic!.play(); // Play the audio
        } else {
            this.gamePlayMusic!.muted = true; // Mute the audio
            this.gamePlayMusic!.pause(); // Pause the audio
        }
    }

    ngOnDestroy(): void {
        console.log('game component ngOnDestroy');
        if (this.gamePlayMusic) {
            this.gamePlayMusic.pause(); // Stop the music
            // reinitialize the audio element to clear
            this.gamePlayMusic = new Audio('/assets/music/game_music.mp3');
        }
    }
}
