import { HighScoreComponent } from '../game-components/high-score.component';
import { ModalComponent } from '../components/modal.component';
import { LogoComponent } from '../components/logo.component';
import { ModalService } from '../services/modal.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ConfigComponent } from '../components/config.component';

@Component({
    selector: 'app-start',
    standalone: true,
    imports: [CommonModule, LogoComponent, ModalComponent, HighScoreComponent, ConfigComponent],
    templateUrl: './start.component.html',
    styles: [
    ]
})
export class StartComponent {

    private router = inject(Router);
    private modalService = inject(ModalService);
    modalType: string = '';

    playGame() {
        this.router.navigate(['/play-game']);
    }

    exitGame() {
        this.router.navigate(['/goodbye']);
    }

    openModal(title: string): void {
        this.modalType = title;
        this.modalService.openModal(title);
    }

    openConfig(title: string): void {
        this.modalType = title;
        this.modalService.openModal(title);
    }
}
