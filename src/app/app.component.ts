import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { GameConfigService } from './services/game-config.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, BoardComponent],
    templateUrl: './app.component.html',
    styles: []
})
export class AppComponent {

    constructor(private configService: GameConfigService) {
        this.init();
    }

    init() {
        this.configService.updateConfig({ columns: 15, rows: 25, blockSize: 20, extended: true, startLevel: 1 });
    }

}