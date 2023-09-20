
import { HighScoreComponent } from 'src/app/controllers/game/high-score.component';
import { ModalComponent } from '../components/modal.component';
import { ModalService } from 'src/app/services/modal.service';
import { LogoComponent } from '../components/logo.component';
import { ConfigComponent } from '../game/config.component';
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
    private modalService = inject(ModalService);
    private routerService = inject(Router);

    modalType: string = '';

    /**
     * Redirect to the game page
     * @returns void
     */
    playGame(): void {
        this.routerService.navigate(['/play-game']);
    }

    /**
     * Redirect to the goodbye page
     * @returns void
     */
    exitGame(): void {
        this.routerService.navigate(['/goodbye']);
    }

    /**
     * Open modal and pass the title of the modal to the modal service
     * @param {string} title The title of the modal to open
     * @returns void
     */
    openModal(title: string): void {
        this.modalType = title;
        this.modalService.openModal(title);
    }

    /**
     * Open the modal and display the configuration component
     * @param {string} title The title of the modal to open
     * @returns void
     */
    openConfig(title: string): void {
        this.modalType = title;
        this.modalService.openModal(title);
    }
    
}
