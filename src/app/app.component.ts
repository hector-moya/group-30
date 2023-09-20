import { ConfigService } from './services/config.service';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { IConfig } from './interfaces/Config';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    templateUrl: './views/app.component.html',
    styles: []
})
export class AppComponent {

    /**
     * Component dependencies
     */
    private configService = inject(ConfigService);
    private titleMusic = new Audio('../../assets/music/01. Title.mp3');
    private gamePlayMusic = new Audio('../../assets/music/02. A-Type Music (v1.0).mp3');
    private router = inject(Router);

    ngOnInit(): void {
        this.subscribeToConfig();
        this.titleMusic.loop = true;
        this.gamePlayMusic.loop = true;

        
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.handleRouteChange();
            }
        });
    }


    /**
     * Subscribe to the configuration updates from the ConfigService.
     * When the configuration changes, the callback function is triggered.
     */
    subscribeToConfig(): void {
        this.configService.observeConfig().subscribe();
    }

    /**
     * Toggle the music and sound on and off
     */
    toggleSound(): void {
        if (this.titleMusic.paused && this.gamePlayMusic.paused) {
            if (this.router.url.includes('/play-game')) {
                this.gamePlayMusic.play();
            } else {
                this.titleMusic.play();
            }
        } else {
            this.titleMusic.pause();
            this.gamePlayMusic.pause();
        }
    }

    /**
     * Toggle the music and sound on and off
     * @param event 
     */
    @HostListener('document:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'm' || event.key === 'M') {
            this.toggleSound();
        }

    }

    /**
     * Stop the music when the component is destroyed
     */
    ngOnDestroy(): void {
        this.titleMusic.pause();
        this.gamePlayMusic.pause();
        this.titleMusic.currentTime = 0;
        this.gamePlayMusic.currentTime = 0;
    }

    /**
     * Handle the route change
     */
    private handleRouteChange() {    
        if (this.router.url.includes('/play-game')) {
            this.playGameMusic();
        } else {
            this.playTitleMusic();
        }
    }

    /**
     * Play the title music
     */
    private playTitleMusic() {
        this.gamePlayMusic.pause();
        this.titleMusic.play();
    }
    
    /**
     * Play the game music
     */
    private playGameMusic() {
        this.titleMusic.pause();
        this.gamePlayMusic.play();
    }
}


