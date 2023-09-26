import { ConfigService } from './services/config.service';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    templateUrl: './views/app.component.html',
    styles: []
})
export class AppComponent {

    private configService = inject(ConfigService);

    ngOnInit() {
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
