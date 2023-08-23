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

    constructor(private configService: GameConfigService) {
        this.init();
    }

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

    init() {
        this.configService.updateConfig({ columns: 15, rows: 25, blockSize: 20, extended: true, startLevel: 1 });

    }
}
