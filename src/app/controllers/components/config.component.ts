import { ToolTipComponent } from '../components/tool-tip.component';
import { IConfig } from 'src/app/models/GameConfig';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
    selector: 'app-config',
    standalone: true,
    imports: [CommonModule, FormsModule, ToolTipComponent],
    templateUrl: './config.component.html',
    styles: []
})

export class ConfigComponent {

    config: IConfig = { columns: 10, rows: 20, blockSize: 30, extended: false, startLevel: 1 };

}
