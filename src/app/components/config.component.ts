import { ToolTipComponent } from '../components/tool-tip.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { GameConfig } from '../defs';

@Component({
    selector: 'app-config',
    standalone: true,
    imports: [CommonModule, FormsModule, ToolTipComponent],
    templateUrl: './config.component.html',
    styles: []
})

export class ConfigComponent {

    config: GameConfig = { columns: 10, rows: 20, blockSize: 30, extended: false, startLevel: 1 };

}
