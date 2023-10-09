import { BehaviorSubject, Observable } from 'rxjs';
import { IConfig } from '../interfaces/Config';
import { Injectable } from '@angular/core';
import { DEFAULT_CONFIG } from '../data';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    /**
     * Config BehaviorSubject to notify subscribers of changes
     */
    private configSubject$: BehaviorSubject<IConfig> = new BehaviorSubject<IConfig>(this.getConfig() || DEFAULT_CONFIG);

    constructor() {
        if (!this.getConfig()) {
            this.setConfig(DEFAULT_CONFIG);
        }
    }

    /**
      * Get the observable that emits the current game configuration.
      * @returns An observable of the current game configuration.
      */
    observeConfig(): Observable<IConfig> {
        return this.configSubject$.asObservable();
    }

    /**
     * Update the game configuration and notify subscribers.
     * @param {IConfig} config The new configuration
     */
    updateConfig(config: IConfig): void {
        this.configSubject$.next(config);
        this.setConfig(config);
    }

    /**
     * Toggle the sound on and off
     */
    toggleSound(): void {
        const currentValue = this.configSubject$.value.hasSound;
        // console.log('toggleSound', currentValue);
        this.configSubject$.next({ ...this.configSubject$.value, hasSound: !currentValue });
    }

    /**
     * Save the configuration to local storage for persistent state
     * @param {IConfig} config The configuration to save
     */
    private setConfig(config: IConfig): void {
        const configJson = JSON.stringify(config);
        localStorage.setItem('config', configJson);
    }

    /**
     * Get the configuration from local storage
     * @returns The configuration from local storage or null if not found
     */
    getConfig(): IConfig | null {
        const configJson = localStorage.getItem('config');
        return configJson ? JSON.parse(configJson) : null;
    }

}
