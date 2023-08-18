import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Config } from '../defs';

@Injectable({
    providedIn: 'root'
})
export class GameConfigService {

    private gameConfig: Config = { columns: 10, rows: 20, blockSize: 30, extended: false };

    /**
     * BehaviorSubject to hold and broadcast the configuration
     */
    private configSubject: BehaviorSubject<Config> = new BehaviorSubject<Config>(this.gameConfig);

    /**
      * Get the observable that emits the current game configuration.
      * @returns An observable of the current game configuration.
      */
    getConfigObservable(): Observable<Config> {
        return this.configSubject.asObservable();
    }

    /**
     * Update the game configuration and notify subscribers.
     * @param config The new configuration to update to.
     */
    updateConfig(config: Config): void {
        this.configSubject.next(config);
    }

}
