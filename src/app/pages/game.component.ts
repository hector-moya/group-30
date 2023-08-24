import { ScoreComponent } from '../game-components/score.component';
import { BoardComponent } from '../board/board.component';
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-game',
    standalone: true,
    imports: [CommonModule, BoardComponent, ScoreComponent],
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
