import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    private modalSubject$ = new BehaviorSubject<{ isOpen: boolean, title: string | null, type: string | null }>({ isOpen: false, title: null, type: null });

    observeModal(): Observable<{ isOpen: boolean, title: string | null, type: string | null }> {
        return this.modalSubject$.asObservable();
    }

    openModal(title: string, type:string = 'default'): void {
        this.modalSubject$.next({ isOpen: true, title: title, type: type });
    }

    closeModal(): void {
        this.modalSubject$.next({ isOpen: false, title: null, type: null });
    }

}
