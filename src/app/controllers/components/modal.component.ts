import { ModalService } from 'src/app/services/modal.service';
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
        <div class="bx-title">{{ title }}</div>
        <div class="bx-content">
          <ng-content></ng-content>
        </div>
        <div class="bx-footer tar">
          <ng-container *ngIf="modalType === 'End Game'; else elseBlock">
            <div class="space-x">
              <button class="btn primary danger" (click)="closeRedirect()">
                Yes
              </button>
              <button class="btn primary success" (click)="closeModal()">
                No
              </button>
            </div>
          </ng-container>
          <ng-template #elseBlock>
            <ng-container *ngIf="modalType === 'Game Over'">              
              <button class="btn primary danger" (click)="closeRedirect()">
                  Close
              </button>
            </ng-container>
            <ng-container *ngIf="modalType !== 'Game Over'">
              <button class="btn primary danger" (click)="closeModal()">
                Close
              </button>
            </ng-container>
          </ng-template>
        </div>
      </div>
    </div>
  `,
})
export class ModalComponent {
  @Input() endGame: boolean = false;
  @Input() gameOver: boolean = false;

  showModal: boolean = false;
  title: string = '';
  modalType: string = '';

  private modalService = inject(ModalService);
  private router = inject(Router);

  ngOnInit() {
    this.modalService.observeModal().subscribe((data) => {
      this.showModal = data.isOpen;
      this.title = data.title ?? '';
      this.modalType = data.type ?? 'default';
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
