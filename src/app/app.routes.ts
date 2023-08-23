import { Routes } from '@angular/router';

export const routes: Routes = [
    // {
    //     path: '',
    //     redirectTo: 'login',
    //     pathMatch: 'full'
    // },
    {
        path: 'start', loadComponent: () => import('./pages/start.component')
            .then(mod => mod.StartComponent)
    },
    {
        path: 'game', loadComponent: () => import('./pages/game.component')
            .then(mod => mod.GameComponent)
    },
];
