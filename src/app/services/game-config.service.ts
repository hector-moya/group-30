import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { GameConfig } from '../defs';

@Injectable({
    providedIn: 'root'
})
export class GameConfigService {

    private gameConfig: GameConfig = { columns: 10, rows: 20, blockSize: 20, extended: false, startLevel: 1};

    /**
     * BehaviorSubject to hold and broadcast the configuration
     */
    private configSubject: BehaviorSubject<GameConfig> = new BehaviorSubject<GameConfig>(this.gameConfig);

    /**
      * Get the observable that emits the current game configuration.
      * @returns An observable of the current game configuration.
      */
    getConfigObservable(): Observable<GameConfig> {
        return this.configSubject.asObservable();
    }

    /**
     * Update the game configuration and notify subscribers.
     * @param config The new configuration to update to.
     */
    updateConfig(config: GameConfig): void {
        this.configSubject.next(config);
    }

}
