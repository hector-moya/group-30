import { ConfigService } from './services/config.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    templateUrl: './views/app.component.html',
    styles: []
})
export class AppComponent {

    constructor(private configService: ConfigService) {
        this.init();
    }

    init() {
        this.configService.updateConfig({
            rows: 20,
            columns: 10,
            blockSize: 25,
            extended: false,
            startLevel: 1,
            nextGridSize: 4
        });
    }

}
