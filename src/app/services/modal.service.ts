import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    private modalSubject$ = new BehaviorSubject<{ isOpen: boolean, title: string | null }>({ isOpen: false, title: null });

    observeModal(): Observable<{ isOpen: boolean, title: string | null }> {
        return this.modalSubject$.asObservable();
    }

    openModal(title: string): void {
        this.modalSubject$.next({ isOpen: true, title: title });
    }

    closeModal(): void {
        this.modalSubject$.next({ isOpen: false, title: null });
    }

}
