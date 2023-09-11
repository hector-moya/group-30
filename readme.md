# 3815 Tetris Team 30

I am color coding the class diagram so you can see what is what. A green box indicates the I
consider the class to be complete, or correct for now. They may be updated as we go but for the
time being the diagram is the same as ore code base.

## Latest Changes

- update observable method names to `observeName` for consistency
- updated all `number[][]` to `matrix`
- update observable subject names to `name$` for convention and consistency
- changed config `nextCol` and `nextRow` to `nextGridSize` for simplicity
- removed some initialization variables and import direct from data.ts for cleaner code
- created interface directory
- moved html to the views directory, this contradicts the angular style guide but I think it is
  cleaner and more appropriate for the assignment

```js
private configSubject$: BehaviorSubject<IConfig> = new BehaviorSubject<IConfig>(DEFAULT_CONFIG);
// replaces
private config: IConfig = { columns: 10, rows: 20, blockSize: 20, extended: false, startLevel: 1};
private configSubject$: BehaviorSubject<IConfig> = new BehaviorSubject<IConfig>(this.config);
```

## These are some things I have leant and just passing it forward

We do not need need to set private variables in the service we can just access the observable directly.

```js
// we can remove these variable and subscribe directly to the observable
// private piece?: Piece;
// private nextPiece?: Piece;

if (type === 'next') {
    // this line is redundant because we are setting the value twice
    // this.nextPiece = piece;
    this.nextPieceSubject$.next(piece);
} else {
    // this line is redundant because we are setting the value twice
    // this.piece = piece;
    this.pieceSubject$.next(piece);
}
```

- how do we show constructor params? do we need to?
- do we need to persist config?
- should we separate the interfaces into their own files? I like how we are handling them but what is expected?

`data.ts` is a file that contains all the constants and initialisation data for the game.

`defs.ts` is a file that contains miscellaneous interfaces for the game.

`controllers/pages` are the components that are loaded into the router outlet. They are the main components that are loaded into the app.


./angular.json
./file-list.txt
./nk_tmp.md
./package-lock.json
./package.json
./readme.md
./src/app/app.component.ts
./src/app/app.config.ts
./src/app/app.routes.ts
./src/app/controllers/components/config.component.ts
./src/app/controllers/components/logo.component.ts
./src/app/controllers/components/modal.component.ts
./src/app/controllers/components/tool-tip.component.ts
./src/app/controllers/game/board.component.ts
./src/app/controllers/game/high-score.component.ts
./src/app/controllers/game/next-piece.component.ts
./src/app/controllers/game/score.component.ts
./src/app/controllers/pages/game.component.ts
./src/app/controllers/pages/goodbye.component.ts
./src/app/controllers/pages/start.component.ts
./src/app/data.ts
./src/app/defs.d.ts
./src/app/interfaces/Config.ts
./src/app/interfaces/DrawingContext.ts
./src/app/interfaces/Piece.ts
./src/app/interfaces/Score.ts
./src/app/interfaces/Tetromino.ts
./src/app/models/Canvas.ts
./src/app/models/Piece.ts
./src/app/services/config.service.ts
./src/app/services/modal.service.ts
./src/app/services/piece.service.ts
./src/app/services/score.service.ts
./src/app/views/app.component.html
./src/app/views/components/config.component.html
./src/app/views/game/score.component.html
./src/app/views/layouts/app-layout.component.ts
./src/app/views/pages/game.component.html
./src/app/views/pages/start.component.html
./src/assets/.gitkeep
./src/assets/favicon.svg
./src/index.html
./src/main.ts
./src/styles.scss
./tsconfig.app.json
./tsconfig.json
./tsconfig.spec.json
