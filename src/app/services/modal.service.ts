import { BehaviorSubject, Observable, filter, first } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    public modalSubject$ = new BehaviorSubject<{ isOpen: boolean, props: any, action?: string }>
        ({ isOpen: false, props: {}, action: '' });

    /**
     *
     * @returns An observable of the modal state.
     */
    observeModal(): Observable<any> {
        return this.modalSubject$.asObservable();
    }

    /**
     * @returns The current state of the modal.
     */
    getModalState(): any {
        return this.modalSubject$.value;
    }

    /**
     * Open the modal dialog.
     * @param title The title of the modal.
     * @param callback (Optional) A callback function to be called when the modal is closed.
     * @param action (Optional) An action identifier to be passed to the callback function.
     */
    openModal(props: any = {}, callback?: (action?: string) => void): void {

        this.modalSubject$.next({ isOpen: true, props });
        // the callback is not passed to the modal component. It is only used
        // here to pass the `action` set in the `closeModal()` method back to
        // the caller when the modal is closed
        if (callback) {
            this.modalSubject$.pipe(
                filter(data => !data.isOpen),
                first()
            ).subscribe(() => {
                // Run the callback function with the `action` parameter
                // defined by the `closeModal()` method
                callback(this.modalSubject$.value.action);
            });
        }
    }

    /**
     * Close the modal and optionally perform an action.
     * @param {string} action 'cancel' | 'confirm
     */
    closeModal(action?: string): void {
        this.modalSubject$.next({ isOpen: false, props: {}, action });
    }
}
