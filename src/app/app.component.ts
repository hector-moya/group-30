import { Component, HostListener, inject } from '@angular/core';
import { ConfigService } from './services/config.service';
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
        this.configService.toggleSound();
    }

    /**
     * Subscribe to the configuration updates from the ConfigService.
     * When the configuration changes, the callback function is triggered.
     */
    subscribeToConfig(): void {
        this.configService.observeConfig().subscribe();
    }

    /**
     * Toggle the music and sound on and off
     * @param event
     */
    @HostListener('document:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'm' || event.key === 'M') {
            this.configService.toggleSound();
        }
    }

}
