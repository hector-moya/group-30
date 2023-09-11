import { ScoreService } from 'src/app/services/score.service';
import { Component, OnInit, inject } from '@angular/core';
import { IGameStats } from 'src/app/interfaces/Score';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-score',
    standalone: true,
    imports: [CommonModule],
    templateUrl: '../../views/game/score.component.html',
    styles: [
    ]
})
export class ScoreComponent implements OnInit {

    private scoreService = inject(ScoreService);

    gameStats!: IGameStats;

    ngOnInit(): void {
        this.subscribeToScore();
    }

    subscribeToScore(): void {
        this.scoreService.observeScore().subscribe((stats: IGameStats) => {
            this.gameStats = stats;
        })
    }

    clear(linesCleared: number): void {
        this.scoreService.updateGameStats(linesCleared);
    }

}


