import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LogoComponent } from '../components/logo.component';

@Component({
    selector: 'app-start',
    standalone: true,
    imports: [CommonModule, LogoComponent],
    templateUrl: './start.component.html',
    styles: [
    ]
})
export class StartComponent {

    private router = inject(Router);

    playGame() {
        this.router.navigate(['/play-game']);
    }

    exitGame() {
        this.router.navigate(['/goodbye']);
    }
}
