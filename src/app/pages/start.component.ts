import { HighScoreComponent } from '../game-components/high-score.component';
import { ConfigComponent } from '../controllers/components/config.component';
import { ModalComponent } from '../controllers/components/modal.component';
import { LogoComponent } from '../controllers/components/logo.component';
import { ModalService } from '../services/modal.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
