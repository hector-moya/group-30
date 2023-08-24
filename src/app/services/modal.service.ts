import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    private showModal = new BehaviorSubject<{ isOpen: boolean, title: string | null }>
        ({ isOpen: false, title: null });

    getShowModal(): Observable<{ isOpen: boolean, title: string | null }> {
        return this.showModal.asObservable();
    }

    openModal(title: string): void {
        this.showModal.next({ isOpen: true, title: title });
    }

    closeModal(): void {
        this.showModal.next({ isOpen: false, title: null });
    }

}
