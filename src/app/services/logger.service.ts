import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoggerService {

    messages: string[] = [];

    log(message: string, storageKey: string = 'logs'): void {
        const existingLogs = JSON.parse(localStorage.getItem(storageKey) || '[]');
        existingLogs.push({ timestamp: new Date(), message });
        localStorage.setItem(storageKey, JSON.stringify(existingLogs));
    }

    getLogs(storageKey: string = 'logs'): {}[] {
        return JSON.parse(localStorage.getItem(storageKey) || '[]');
    }

}
