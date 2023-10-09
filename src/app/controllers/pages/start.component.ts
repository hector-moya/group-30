
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

@Component({
    selector: 'app-start',
    standalone: true,
    imports: [CommonModule, LogoComponent, ModalComponent, HighScoreComponent, ConfigComponent],
    templateUrl: '../../views/pages/start.component.html',
    styles: [
    ]
})
export class StartComponent {

    /**
     * Component dependencies
     */
    private configService = inject(ConfigService);
    private modalService = inject(ModalService);
    private router = inject(Router);

    modalType: string = '';
    config!: IConfig;
    hasSound!: boolean;

    ngOnInit() {
        this.configService.observeConfig().subscribe((config: IConfig) => {
            this.config = config;
            this.hasSound = config.hasSound!;
        });
    }

    toggleSound() {
        this.configService.toggleSound();
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
}
