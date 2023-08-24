import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    private showModal: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    getShowModal(): Observable<boolean> {
        return this.showModal.asObservable();
    }

    openModal(): void {
        this.showModal.next(true);
    }

    closeModal(): void {
        this.showModal.next(false);
    }
}
