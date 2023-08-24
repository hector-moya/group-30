import { Component, OnInit, inject } from '@angular/core';
import { ScoreService } from '../services/score.service';
import { CommonModule } from '@angular/common';
import { GameStats } from '../defs';
import { POINTS } from '../data';

@Component({
    selector: 'app-score',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './score.component.html',
    styles: [
    ]
})
export class ScoreComponent implements OnInit {

    private scoreService = inject(ScoreService);

    gameStats: GameStats = { score: 0, lines: 0, level: 0, levelUp: 0 };

    ngOnInit(): void {
        this.scoreService.getScoreObservable().subscribe((stats: GameStats) => {
            this.gameStats = stats;
        })
    }

    clear(linesCleared: number) {
        this.scoreService.updateScore(linesCleared);
    }

}
