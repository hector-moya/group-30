import { ModalService } from 'src/app/services/modal.service';
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IModalButton } from 'src/app/defs';
import { Router } from '@angular/router';

@Component({
    selector: 'modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="overlay flex" *ngIf="showModal">

        <div class="minw-300 maxw-sm mxy-auto bx">

            <ng-container *ngIf="props.title">
                <div class="bx-title">{{ props.title }}</div>
            </ng-container>

            <div class="bx-content">
                <ng-content></ng-content>
            </div>

            <div class="bx-footer tar space-x">
                <ng-container *ngFor="let button of buttons">
                    <button class="btn {{ button.class }}" (click)="executeAction( button.action!.toString() )">{{ button.label }}</button>
                </ng-container>
            </div>
        </div>
    </div>
  `
})

export class ModalComponent {

    /**
        * Custom buttons to display in the modal footer
        */
    @Input() customButtons?: { label: string, class: string, action: () => void }[];

    /**
     * Dynamic props to passed to the modal
     */
    props: any = {};

    showModal: boolean = false;

    /**
     * Custom buttons to display in the modal footer
     */
    buttons: IModalButton[] = [{
        label: 'confirm', class: 'primary', action: () => this.closeModal('close'),
    }];

    private modalService = inject(ModalService);
    private router = inject(Router);

    /**
     * Map the action to perform when the modal is closed
     */
    buttonActions: { [key: string]: () => void } = {
        close: () => this.closeModal('close'),
        playAgain: () => this.closeModal('playAgain'),
        redirect: () => this.closeRedirect('redirect'),
        saveConfig: () => this.closeModal('saveConfig'),
    };

    ngOnInit() {
        this.modalService.observeModal().subscribe(modal => {
            this.showModal = modal.isOpen;
            this.props = modal.props;
            this.buttons = modal.props.buttons
                ?? [{ label: 'Close', class: 'primary', action: () => this.closeModal('close') }];
        });
    }

    closeModal(action: string): void {
        this.modalService.closeModal(action);
    }

    closeRedirect(action: string): void {
        this.modalService.closeModal(action);
        this.router.navigate(['/start']);
    }

    executeAction(actionName: string): void {
        const action = this.buttonActions[actionName];
        if (action) {
            action();
        } else {
            throw new Error(`Invalid button action. ${actionName} is not defined in thee button actions array`);
        }
    }
}
