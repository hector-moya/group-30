import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../components/logo.component';

@Component({
    selector: 'app-goodbye',
    standalone: true,
    imports: [CommonModule, LogoComponent],
    template: `
    <div class="container maxw-md">
        <div class="flex-col justify-center items-center mt-3">
            <logo class="wh-10" />
            <div class="my-3 txt-2.5 tac">
                Thank You for playing our game! <br>
                You can now close your browser window.
            </div>
        </div>
    </div>`
})
export class GoodbyeComponent {

}
