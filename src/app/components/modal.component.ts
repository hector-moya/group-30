import { ModalService } from '../services/modal.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="overlay flex" *ngIf="showModal">
        <div class="maxw-400 mxy-auto bx">
            <div class="bx-content">
                <ng-content></ng-content>
            </div>
            <div class="bx-footer tar">
                <button class="btn btn-primary danger" (click)="closeModal()">Close</button>
            </div>
        </div>
    </div>
  `
})
export class ModalComponent {

    showModal: boolean = false;

    private modalService = inject(ModalService);

    ngOnInit() {
        this.modalService.getShowModal().subscribe(showModal => {
            this.showModal = showModal;
        });
    }

    closeModal(): void {
        this.modalService.closeModal();
    }
}
