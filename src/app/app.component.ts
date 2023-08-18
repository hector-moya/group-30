import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BoardComponent } from './board/board.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, BoardComponent],
    templateUrl: './app.component.html',
    styles: []
})
export class AppComponent {
    title = '3815_tetris_team_30';
}
