import { ModalService } from '../services/modal.service';
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="overlay flex" *ngIf="showModal">
        <div class="minw-300 mxy-auto bx">
            <div class="bx-title">{{ title}}</div>
            <div class="bx-content">
                <ng-content></ng-content>
            </div>
            <div class="bx-footer tar">
                <ng-container *ngIf="endGame">
                    <div class="space-x">
                        <button class="btn btn-primary danger" (click)="closeRedirect()">Yes</button>
                        <button class="btn btn-primary success" (click)="closeModal()">No</button>
                  </div>
                </ng-container>
                <ng-template #elseBlock>
                    <button class="btn btn-primary danger" (click)="closeModal()">Close</button>
                </ng-template>
            </div>
        </div>
    </div>
  `
})

export class ModalComponent {

    @Input() endGame: boolean = false;

    showModal: boolean = false;
    title: string = '';

    private modalService = inject(ModalService);
    private router = inject(Router);

    ngOnInit() {
        this.modalService.getShowModal().subscribe(data => {
            this.showModal = data.isOpen;
            this.title = data.title ?? '';
        });
    }

    closeModal(): void {
        this.modalService.closeModal();
    }

    closeRedirect(): void {
        this.router.navigate(['/start']);
        this.modalService.closeModal();
    }
}
