import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule],
    template: `
        <main>
            <div [ngClass]="{
                'container py-5': true,
                'maxw-sm': width === 'sm',
                'maxw-md': width === 'md' || !width,
                'maxw-lg': width === 'lg',
            }">
                <ng-content></ng-content>
            </div>
        </main>
    `
})

export class AppLayout {

    @Input() width?: string = '';

}
