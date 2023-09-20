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

    gameStats!: IGameStats;

    /**
     * Component dependencies
     */
    private scoreService = inject(ScoreService);

    ngOnInit(): void {
        this.subscribeToScore();
    }

    /**
     * Subscribe to the score updates from the ScoreService which is
     * responsible for maintain the game statistics.
     */
    subscribeToScore(): void {
        this.scoreService.observeScore().subscribe((stats: IGameStats) => {
            this.gameStats = stats;
        })
    }

    /**
     * This is a development function and can be removed.
     * @param {number} linesCleared The number of lines cleared.
     */
    clear(linesCleared: number): void {
        this.scoreService.updateGameStats(linesCleared);
    }
}


