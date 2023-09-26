import { ConfigService } from 'src/app/services/config.service';
import { IConfig } from 'src/app/interfaces/Config';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-config',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: '../../views/game/config.component.html'
})

export class ConfigComponent {

    config!: IConfig;

    /**
     * Component dependencies
     */
    private configService = inject(ConfigService);

    ngOnInit() {
        this.configService.observeConfig().subscribe((config: IConfig) => {
            this.config = config;
        });
    }

    /**
     * Update the configuration and notify subscribers
     */
    updateConfig() {
        this.configService.updateConfig(this.config);
    }
}
