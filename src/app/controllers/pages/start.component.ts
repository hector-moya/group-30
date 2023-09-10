
import { HighScoreComponent } from 'src/app/controllers/game/high-score.component';
import { ConfigComponent } from '../components/config.component';
import { ModalComponent } from '../components/modal.component';
import { ModalService } from 'src/app/services/modal.service';
import { LogoComponent } from '../components/logo.component';
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
