
import { HighScoreComponent } from 'src/app/controllers/game/high-score.component';
import { ConfigService } from 'src/app/services/config.service';
import { ModalComponent } from '../components/modal.component';
import { ModalService } from 'src/app/services/modal.service';
import { LogoComponent } from '../components/logo.component';
import { ConfigComponent } from '../game/config.component';
import { IConfig } from 'src/app/interfaces/Config';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ENV } from 'src/app/env';

@Component({
    selector: 'app-start',
    standalone: true,
    imports: [CommonModule, LogoComponent, ModalComponent, HighScoreComponent, ConfigComponent],
    templateUrl: '../../views/pages/start.component.html'
})
export class StartComponent {

    devMode: boolean = ENV.DEV_MODE;

    /**
     * Component dependencies
     */
    private configService = inject(ConfigService);
    private modalService = inject(ModalService);
    private router = inject(Router);

    modalType: string = '';
    config!: IConfig;
    hasSound!: boolean;
    private titleMusic: HTMLAudioElement | null = new Audio('/assets/music/title_music.mp3');

    ngOnInit() {
        this.titleMusic!.loop = true;

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
            this.titleMusic!.muted = false; // Unmute the audio
            this.titleMusic!.play(); // Play the audio
        } else {
            this.titleMusic!.muted = true; // Mute the audio
            this.titleMusic!.pause(); // Pause the audio
        }
    }

    ngOnDestroy(): void {
        console.log('start component ngOnDestroy');
        if (this.titleMusic) {
            this.titleMusic.pause(); // Stop the music
            // reinitialize the audio element to clear
            this.titleMusic = new Audio('/assets/music/title_music.mp3');
        }
    }

    playGame() {
        this.router.navigate(['/play-game']);
    }

    exitGame() {
        this.router.navigate(['/goodbye']);
    }

    openHighScores(): void {
        this.modalType = 'highScores';
        this.modalService.openModal({ title: 'Top 10 High Scores' });
    }

    openConfig(): void {
        this.modalType = 'config';
        this.modalService.openModal({
            title: 'Configure game settings',
            buttons: [
                { label: 'Cancel', class: '', action: 'close' },
                { label: 'Save and Close', class: 'primary', action: 'saveConfig' },
            ]
        }, (action?: string) => {
            this.configService.updateConfig(this.config);
        });
    }

    displayControls(){
        this.modalType = 'controls';
        this.modalService.openModal({ });

    }
}
