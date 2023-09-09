import { ConfigService } from './services/config.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    templateUrl: './app.component.html',
    styles: []
})
export class AppComponent {

    constructor(private configService: ConfigService) {
        this.init();
    }

    init() {
        this.configService.updateConfig({ columns: 15, rows: 25, blockSize: 20, extended: true, startLevel: 1 });
    }

}
