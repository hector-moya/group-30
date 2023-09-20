import { ConfigService } from './services/config.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IConfig } from './interfaces/Config';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    templateUrl: './views/app.component.html',
    styles: []
})
export class AppComponent {

    /**
     * Component dependencies
     */
    private configService = inject(ConfigService);

    ngOnInit(): void {
        this.subscribeToConfig();
    }

    /**
     * Subscribe to the configuration updates from the ConfigService.
     * When the configuration changes, the callback function is triggered.
     */
    subscribeToConfig(): void {
        this.configService.observeConfig().subscribe();
    }
}


