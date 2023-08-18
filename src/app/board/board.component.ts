import { Component, OnInit, inject } from '@angular/core';
import { GameConfigService } from '../services/game-config.service';
import { CommonModule } from '@angular/common';
import { Config } from '../defs';

@Component({
    selector: 'app-board',
    standalone: true,
    imports: [CommonModule],
    template: `<canvas #board class="bdr-red bdr-3"></canvas>`,
    styles: []
})

export class BoardComponent implements OnInit {

    private configService = inject(GameConfigService);

    ngOnInit(): void {
        this.subscribeToConfig();
    }

    /**
     * Subscribe to the configuration updates from the GameConfigService.
     * When the configuration changes, the callback function is triggered.
     */
    subscribeToConfig(): void {
        // Subscribe to the getConfigObservable() method of the GameConfigService
        this.configService.getConfigObservable().subscribe((config: Config) => {
            console.log(config);
        });
    }

}
