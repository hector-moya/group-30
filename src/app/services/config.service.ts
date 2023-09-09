import { BehaviorSubject, Observable } from 'rxjs';
import { IConfig } from '../models/Config';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    private config: IConfig = { columns: 10, rows: 20, blockSize: 20, extended: false, startLevel: 1};

    /**
     * BehaviorSubject to hold and broadcast the configuration
     */
    private configSubject: BehaviorSubject<IConfig> = new BehaviorSubject<IConfig>(this.config);

    /**
      * Get the observable that emits the current game configuration.
      * @returns An observable of the current game configuration.
      */
    getConfigObservable(): Observable<IConfig> {
        return this.configSubject.asObservable();
    }

    /**
     * Update the game configuration and notify subscribers.
     * @param config The new configuration to update to.
     */
    updateConfig(config: IConfig): void {
        this.configSubject.next(config);
    }

}
