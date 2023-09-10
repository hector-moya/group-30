import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'play-game',
        pathMatch: 'full'
    },
    {
        path: 'start', loadComponent: () => import('./pages/start.component')
            .then(mod => mod.StartComponent)
    },
    {
        path: 'play-game', loadComponent: () => import('./controllers/pages/game.component')
            .then(mod => mod.GameComponent)
    },
    {
        path: 'goodbye', loadComponent: () => import('./pages/goodbye.component')
            .then(mod => mod.GoodbyeComponent)
    },
];
