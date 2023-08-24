import { HighScoreComponent } from '../game-components/high-score.component';
import { ModalComponent } from '../components/modal.component';
import { LogoComponent } from '../components/logo.component';
import { ModalService } from '../services/modal.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-start',
    standalone: true,
    imports: [CommonModule, LogoComponent, ModalComponent, HighScoreComponent],
    templateUrl: './start.component.html',
    styles: [
    ]
})
export class StartComponent {

    private router = inject(Router);
    private modalService = inject(ModalService);

    playGame() {
        this.router.navigate(['/play-game']);
    }

    exitGame() {
        this.router.navigate(['/goodbye']);
    }

    openModal(title: string): void {
        this.modalService.openModal(title);
    }
}
