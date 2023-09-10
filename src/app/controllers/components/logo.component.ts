import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'logo',
    standalone: true,
    imports: [CommonModule],
    template: ` <img src="assets/favicon.svg" alt="team 30" class="{{ class }}"> `,
})
export class LogoComponent {

    @Input() class: string = 'wh-5';;

}
