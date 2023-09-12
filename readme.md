# 3815 Tetris Team 30

<!-- TOC -->

- [Files and directories](#files-and-directories)
- [Directory Overview](#directory-overview)
    - [controllers](#controllers)
    - [Interfaces](#interfaces)
    - [Models](#models)
    - [Services](#services)
    - [Views](#views)

<!-- /TOC -->
<a id="markdown-files-and-directories" name="files-and-directories"></a>

## Files and directories

```bash
# count directories excluding node_modules, .angular, .git, .vscode
find . -type d -not -path "./node_modules/*" -not -path "./.angular/*" -not -path "./.git/*" -not -path "./.vscode/*"| wc -l
# list all files excluding directories node_modules, .angular, .git, .vscode
find . -type d \( -path './node_modules' -o -path './.angular' -o -path './.git' -o -path './.vscode' \) -prune -o -type f -print
# list all files excluding directories node_modules, .angular, .git, .vscode, excluding files .gitignore, .editorconfig
find . -type d \( -path './node_modules' -o -path './.angular' -o -path './.git' -o -path './.vscode' \) -prune -o -type f -not -name .gitignore -not -name .editorconfig -print

# count all files excluding the root directory
find . -type d \( -path './node_modules' -o -path './.angular' -o -path './.git' -o -path './.vscode' \) -prune -o -type f -not -name .gitignore -not -name .editorconfig -print | wc -l
```


<a id="markdown-directory-overview" name="directory-overview"></a>

## Directory Overview

<a id="markdown-controllers" name="controllers"></a>

### controllers

The `src/app/controllers` directory contains the components that are responsible for the application's business logic. The directory is broken into three subdirectories: `components`, `game`, and `pages`. <br>

The `controllers/components` directory contains the components that are used to build the UI of the application. <br>

`src/app/controllers/components/logo.component.ts`: UI component responsible for displaying the application's logo. <br>
`src/app/controllers/components/modal.component.ts`: UI component responsible for displaying pop-up modals and dialogs. <br>
`src/app/controllers/components/tool-tip.component.ts`: This file probably contains the tooltip component, which provides interactive tooltips or hints to player. <br>

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

### Interfaces

The `src/app/interfaces` directory contains the interfaces that are used to define the structure of the application's data. <br>

`src/app/interfaces/Config.ts`: Interface for the game's configuration settings. <br>
`src/app/interfaces/DrawingContext.ts`: Interface for the game's drawing context. <br>
`src/app/interfaces/Piece.ts`: Interface for the game's pieces. <br>
`src/app/interfaces/Position.ts`: Interface for the game's positions. <br>
`src/app/interfaces/Score.ts`: The score interface has all score relate interfaces such as `IGameStats`, `Point` and`HighScore`. <br>
`src/app/interfaces/Tetromino.ts`: Interface for the game's tetrominos. <br>

<a id="markdown-models" name="models"></a>

### Models

The `src/app/models` directory contains the models that are used to define the structure of the
application's data. <br>

`src/app/models/Canvas.ts`: The canvas model is responsible for managing the game's canvas. <br>
`src/app/models/Piece.ts`: The piece model is responsible for managing the game's pieces. <br>

<a id="markdown-services" name="services"></a>

### Services

The `src/app/services` directory contains the services that are used to manage the application's
data. These services often utilise observables to handle data and communicate across different
parts of the application. <br>

`src/app/services/ConfigService.ts`: The `ConfigService` is responsible for managing the game's
configuration settings. It ensures that the game's parameters, such as board size, block size and
start level, can be easily customised and that these changes are reflected throughout the
application. <br>

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

### Views

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



???? Maybe

**index.html**: The `index.html` file is the starting point of an Angular application. It serves
as the main HTML file and provides the basic structure for the web page. Inside the `<body>` tag,
you find a `<app-root>` tag, which acts as a placeholder for the root component of the Angular
application.

**app.component.ts**: The `app.component.ts` file defines the root component of the Angular
application. It is a TypeScript file that contains a class representing the component. This class
is decorated with `@Component` metadata, which includes information about the component, such as
its template and styles.

**app.component.html**: The `app.component.html` file is the template associated with the root
component. It defines the structure and layout of the root component's view. This HTML template
can include dynamic data binding, conditional rendering, and event handling, making it a crucial
part of building the user interface for the application.

These files work together to create a single-page application in Angular, with `index.html` as the
entry point, `app.component.ts` defining the root component, and `app.component.html` specifying
the layout and structure of the root component's view.
