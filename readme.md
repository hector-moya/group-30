# 3815 Tetris Team 30

<!-- TOC -->

- [Priority List](#priority-list)
- [Bugs](#bugs)
- [Low Priority](#low-priority)
- [Testing](#testing)
- [Naming conventions](#naming-conventions)
- [Directory structure and files](#directory-structure-and-files)
- [src](#src)
    - [app](#app)
        - [controllers](#controllers)
        - [Interfaces](#interfaces)
        - [Models](#models)
        - [Services](#services)
        - [Views](#views)
    - [Assets](#assets)
- [Source code line count](#source-code-line-count)

<!-- /TOC -->

- [ ] finish off config modal to make AI and Play buttons work

<a id="markdown-priority-list" name="priority-list"></a>

## Priority List

- [ ] when cancelling out of the escape (end game), the loop needs to restart. Emit an event to
  the parent component to restart the game loop
- [ ] handle switch current and next tetromino (after locked method)
- [ ] Wire up the configuration so it affects the game
    - [ ] Game level needs to work with the interval
    - [ ] remember state
- [ ] Remember state for high scores

- the config is wired but there are problems with the grid
    - save/cancel?
    - changes are automatic and final (offer reset button)

<a id="markdown-bugs" name="bugs"></a>

## Bugs

- [ ] there is a bug when the piece is rotated against the wall it triggers the lock method
- [ ] Top collision is working but it needs to fire earlier

<a id="markdown-low-priority" name="low-priority"></a>

## Low Priority

- [ ] add comments to the ui for controls
- [ ] hard drop???
- [ ] Change the randomize tetromino method to reduce the change of getting the same shape twice in a row
 - [ ] center the next piece in it's canvas

<a id="markdown-testing" name="testing"></a>

## Testing
| Criteria                | Video Length | Points |
| ----------------------- | ------------ | ------ |
| Video Length            | < 7 minutes  | 5      |
| Normal Game Functions   | Yes          | 15     |
| Game Completion         | Two ways     | 5      |
| Top Score Page          | Yes          | 5      |
| Sound and Music         | Yes          | 5      |
| Extended Game           | Yes          | 5      |
| AI Game                 | Yes          | 10     |
| Different Levels        | Yes          | 5      |
| Different Size of Field | Yes          | 5      |


<a id="markdown-naming-conventions" name="naming-conventions"></a>

## Naming conventions

1. **Class Naming Convention**:
   - Classes are named using PascalCase, where each word in the class name starts with an uppercase letter.
   - Example: `BoardComponent`, `GameService`
2. **Object Naming Convention**:
   - Objects and instances of classes are typically named using camelCase, starting with a lowercase letter.
   - Example: `intervalId`, `piece`, `ctx`, `moves`
3. **Function Naming Convention**:
   - Function names are using camelCase, starting with a lowercase letter.
   - Descriptive names are used to indicate the purpose of the function.
   - Example: `initBoard()`, `subscribeToPiece()`, `startInterval()`, `stopInterval()`, `handleEscape()`, `handleGameOver()`
4. **Variable Naming Convention**:
   - Variables follow camelCase and have descriptive names to convey their purpose.
   - Example: `pieceService`, `modalService`, `gameService`, `modalType`, `linesCleared`
5. **Private Members Convention**:
   - Private members (variables and functions) are declared using the `private` keyword to indicate their private nature.
   - Example: `private intervalId`, `private piece`, `private ctx`, `private moves`
6. **Interface Naming Convention**:
   - Interfaces are named using PascalCase and often represent contracts or data structures.
   - Example: `IConfig`, `IPosition`
7. **Parameter Naming Convention**:
   - Function parameters are named using camelCase.
   - Descriptive names are used to indicate the purpose of each parameter.
   - Example: `initBoard()`, `onKeydown(event)`, `moveAndRenderGrid(shape, position)`
8. **Constants Naming Convention**:
   - Constants are typically named in UPPERCASE_WITH_UNDERSCORES to distinguish them from variables.
   - Example: `GRID`, `TETROMINOS`, `EXT_TETROMINOS`
9. **Type Naming Convention**:
   - Types are named using PascalCase and are often used to define custom data types.
   - Example: `Matrix`

<a id="markdown-directory-structure-and-files" name="directory-structure-and-files"></a>

## Directory structure and files

```
src
|-- app
|   |-- controllers
|   |   |-- components
|   |   |-- game
|   |   |-- pages
|   |-- interfaces
|   |-- models
|   |-- services
|   |-- views
|   |   |-- game
|   |   |-- layouts
|   |   |-- pages
|   assets
|   |-- music
```

<a id="markdown-src" name="src"></a>

## src

`src` is the root directory of the Angular project. It contains all the source code for the application.

The `index.html` file is the starting point of an Angular application. It serves as the main HTML
file and provides the basic structure for the web page. Inside the `<body>` tag, you find a
`<app-root>` tag, which acts as a placeholder for the root component of the Angular application.

The `main.ts` file is the main entry point of the application. It is a TypeScript file that
contains the code responsible for bootstrapping the application. It imports the `AppModule` from
`app.module.ts` and uses the `platformBrowserDynamic` function to bootstrap the application.

The `styles.scss` file is the main stylesheet for the application. It is a Sass file that contains
global styles for the application. It is imported into the `app.component.ts` file, which ensures
that the styles are applied to the entire application.

<a id="markdown-app" name="app"></a>

### app

The `src/app` directory is the main application directory containing various Angular components.

Certainly, here are brief and concise descriptions for each of the provided files:

The `app.component.ts` file is the main component of the Angular application, responsible for
defining the application's root component and its behavior.

The `app.config.ts` file contains configuration settings and parameters that can be used to
customize and set up the application.

The `app.routes.ts` file defines the routing configuration for the application, specifying how
different URLs map to specific components and views.

The `data.ts` file serves as a source for storing and managing data used within the Angular
application.

The `defs.d.ts` file contains TypeScript type definitions or declarations that help in specifying
custom types or interfaces used throughout the application.

<a id="markdown-controllers" name="controllers"></a>

#### controllers

The `src/app/controllers` directory contains the components that are responsible for the application's business logic. The directory is broken into three subdirectories: `components`, `game`, and `pages`. <br>

The `controllers/components` directory contains the components that are used to build the UI of the application. <br>

`src/app/controllers/components/logo.component.ts`: UI component responsible for displaying the application's logo. <br>
`src/app/controllers/components/modal.component.ts`: UI component responsible for displaying pop-up modals and dialogs. <br>

The `controllers/game` directory contains the components that are central to the game's functionality <br>

`src/app/controllers/game/board.component.ts`: This is the game board component, which represents the main playing area of the game. <br>
`src/app/controllers/game/config.component.ts`: The configuration component is responsible for displaying the game's configuration settings. <br>
`src/app/controllers/game/high-score.component.ts`: The high component is responsible for managing and displaying high scores in the game. <br>
`src/app/controllers/game/next-piece.component.ts`: The next piece component is responsible for displaying the upcoming game piece within the game. <br>
`src/app/controllers/game/score.component.ts`: The score component is responsible for displaying and updating the player's score during the game. <br>

The `/controllers/pages/` directory contains components representing different URLs where users can visit to play and interact with the application. <br>

`src/app/controllers/pages/game.component.ts`: This is the game page component responsible for displaying the game board and other game-related components. <br.>
`src/app/controllers/pages/goodbye.component.ts`: The goodbye page component is responsible for displaying a "goodbye" message when a player exits the application. <br.>
`src/app/controllers/pages/start.component.ts`: The start page component is the application's main landing page where players initiate their interaction with the game. <br.>

<a id="markdown-interfaces" name="interfaces"></a>

#### Interfaces

The `src/app/interfaces` directory contains the interfaces that are used to define the structure of the application's data. <br>

`src/app/interfaces/Config.ts`: Interface for the game's configuration settings. <br>
`src/app/interfaces/DrawingContext.ts`: Interface for the game's drawing context. <br>
`src/app/interfaces/Piece.ts`: Interface for the game's pieces. <br>
`src/app/interfaces/Position.ts`: Interface for the game's positions. <br>
`src/app/interfaces/Score.ts`: The score interface has all score relate interfaces such as `IGameStats`, `Point` and`HighScore`. <br>
`src/app/interfaces/Tetromino.ts`: Interface for the game's tetrominos. <br>

<a id="markdown-models" name="models"></a>

#### Models

The `src/app/models` directory contains the models that are used to define the structure of the
application's data. <br>

`src/app/models/Canvas.ts`: The canvas model is responsible for managing the game's canvas. <br>
`src/app/models/Piece.ts`: The piece model is responsible for managing the game's pieces. <br>

<a id="markdown-services" name="services"></a>

#### Services

The `src/app/services` directory contains the services that are used to manage the application's
data. These services often utilise observables to handle data and communicate across different
parts of the application. <br>

`src/app/services/ConfigService.ts`: The `ConfigService` is responsible for managing the game's
configuration settings. It ensures that the game's parameters, such as board size, block size and
start level, can be easily customised and that these changes are reflected throughout the
application. <br>

`src/app/services/GameService.ts`: The `GameService` is responsible for managing the game state
and functionality including collision detection, grid management, piece locking, and various other
functions related to the game. <br>

`src/app/services/modal.service.ts`: The `ModalService` handles the display of pop-up modals and
dialogs within the application. It provides a convenient way for creating and displaying user
messages. <br>

`src/app/services/piece.service.ts`: The `PieceService` is the core service responsible for
managing the game pieces and their state. It plays a crucial role in providing real-time updates
on the current game piece, next piece, and other relevant game data to various components.
Additionally, it handles all functions related to game piece movement including rotation,
translation, and collision detection. <br>

`src/app/services/score.service.ts`: The `ScoreService` manages the player's score during the
game. It tracks and updates the score each time the player clears a line or levels up. It also
handles the game's high scores, ensuring that they are recorded and displayed correctly. <br>

<a id="markdown-views" name="views"></a>

#### Views

The `src/app/views` directory contains views responsible for displaying the application's
components and content. It's divided into subdirectories, such as `components`, `game`, `pages`,
and `layouts`, each handling specific aspects of the user interface.

These views include HTML files that work together with the components to render different parts of
the application. Additionally, the `layouts` subdirectory contains layout components that define
the structure of pages or sections, ensuring a consistent visual design across the app.

`src/app/views/app.component.html`: This HTML file represents the main layout of the application, serving as the container for various components and content. <br>
`src/app/views/game/config.component.html`: This HTML file is responsible for displaying the game's configuration settings, allowing players to customise aspects of the game. <br>
`src/app/views/game/score.component.html`: This HTML file displays the player's score during gameplay, showing current scores, high scores, and other game statistics. <br>
`src/app/views/layouts/app-layout.component.ts`: This TypeScript file defines the overall structure of the application's user interface, including common elements like `headers`, `footers`, and `navigation` menus. <br>
`src/app/views/pages/game.component.html`: This HTML file represents the game page view, rendering the game board and other game-related components. <br>
`src/app/views/pages/start.component.html`: This HTML file represents the start page view, serving as the initial landing page for players to begin their interaction with the game. <br>




<a id="markdown-assets" name="assets"></a>

### Assets

The `src/assets` directory contains the static assets used by the application, such as images,
icons, and music.

`/src/assets/favicon.svg` application logo
`/src/assets/music/title_music.mp3` start screen music
`/src/assets/music/game_music.mp3` game screen music

<a id="markdown-source-code-line-count" name="source-code-line-count"></a>

## Source code line count

Total lines 1810

```
109 ./src/app/app.component.ts
8 ./src/app/app.config.ts
21 ./src/app/app.routes.ts
14 ./src/app/controllers/components/logo.component.ts
84 ./src/app/controllers/components/modal.component.ts
209 ./src/app/controllers/game/board.component.ts
35 ./src/app/controllers/game/config.component.ts
101 ./src/app/controllers/game/high-score.component.ts
63 ./src/app/controllers/game/next-piece.component.ts
46 ./src/app/controllers/game/score.component.ts
43 ./src/app/controllers/pages/game.component.ts
23 ./src/app/controllers/pages/goodbye.component.ts
62 ./src/app/controllers/pages/start.component.ts
111 ./src/app/data.ts
2 ./src/app/defs.d.ts
8 ./src/app/interfaces/Config.ts
6 ./src/app/interfaces/DrawingContext.ts
6 ./src/app/interfaces/Piece.ts
4 ./src/app/interfaces/Position.ts
25 ./src/app/interfaces/Score.ts
5 ./src/app/interfaces/Tetromino.ts
32 ./src/app/models/Canvas.ts
99 ./src/app/models/Piece.ts
58 ./src/app/services/config.service.ts
174 ./src/app/services/game.service.ts
22 ./src/app/services/modal.service.ts
165 ./src/app/services/piece.service.ts
73 ./src/app/services/score.service.ts
1 ./src/app/views/app.component.html
55 ./src/app/views/game/config.component.html
34 ./src/app/views/game/score.component.html
26 ./src/app/views/layouts/app-layout.component.ts
28 ./src/app/views/pages/game.component.html
36 ./src/app/views/pages/start.component.html
16 ./src/index.html
6 ./src/main.ts
```

```bash
# Get the total number of lines in each file excluding node_modules
find . -type d -name "node_modules" -prune -o -type f \( -name "*.ts" -o -name "*.js" -o -name "*.html" \) -exec wc -l {} \;
# Get the total lines of code for the project
find . -type d -name "node_modules" -prune -o -type f \( -name "*.ts" -o -name "*.js" -o -name "*.html" \) -exec cat {} \; | wc -l
```
