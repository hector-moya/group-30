import { BehaviorSubject, Observable } from 'rxjs';
import { IConfig } from '../interfaces/Config';
import { Injectable } from '@angular/core';
import { DEFAULT_CONFIG } from '../data';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    /**
     * BehaviorSubject to hold and broadcast the configuration
     */
    private configSubject$: BehaviorSubject<IConfig> = new BehaviorSubject<IConfig>(DEFAULT_CONFIG);

    /**
      * Get the observable that emits the current game configuration.
      * @returns An observable of the current game configuration.
      */
    observeConfig(): Observable<IConfig> {
        return this.configSubject$.asObservable();
    }

    /**
     * Update the game configuration and notify subscribers.
     * @param config The new configuration to update to.
     */
    updateConfig(config: IConfig): void {
        this.configSubject$.next(config);
    }

}
