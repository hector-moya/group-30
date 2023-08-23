import { GameConfigService } from '../services/game-config.service';
import { BoardComponent } from '../board/board.component';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

@Component({
    selector: 'app-game',
    standalone: true,
    imports: [CommonModule, BoardComponent],
    templateUrl: './game.component.html',
    styles: [
    ]
})
export class GameComponent {

    @ViewChild(BoardComponent, { static: true }) boardComponent!: BoardComponent;

    play(): void {
        this.boardComponent.startGame();
    }

    pause(): void {
        this.boardComponent.pauseGame();
    }

    rotate(): void {
        this.boardComponent.moveUp();
    }
}
