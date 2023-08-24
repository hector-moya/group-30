# 3815 Tetris Team 30

## First Phase Checklist

### Start up page

The video should show a startup page when the game starts, displaying the following:

1. [x] The title of Tetris
2. [x] The year and course code
3. [x] The list of all students in your group.
4. [x] An exit button to exit the program.
5. [x] A score button to get into top score page.
6. [x] A configure button get into configure page.
7. [x] Click the exit button will exit the prototype.
    - [x] Redirect to a page that says "Thanks for playing"

### Top Scores Page

1. [x] To click the score button in the start up page pop up the top score page
2. [x] The top score page will display 10 best scores and the users (The data can be fake in the
   prototype)
3. [x] A close button in the page, when player click that button, the top score page will be closed
   and return to start up page

### Configure page

1. [x] To click the configure button in the start up page pop up the configure page.
2. [x] The configure page shows following configure items. (in the prototype, you only need to
   display following settings, functions of those settings are not asked)
    - [x] Size of the field
    - [x] Game level
    - [x] Normal or extended game
    - [x] Player or AI game mode
3. [x] A close button in the page, when player click that button, the top score page will be
   closed and return to start up page

### Prototype

1. [ ] Clicking the play button in the start-up page opens the game page.
2. [ ] The game page should display the following items:
    - [x] Game field and a dropping block.
    - [ ] Your group number.
    - [x] Current score of the session.
    - [x] Number of lines eliminated in the session.
    - [x] Current level.
    - [ ] Extended or normal game.
    - [ ] Player or AI mode.
    - [ ] Next block (the shape of the next dropping block when the current one reaches the bottom).
3. [x] The dropping block should be seen dropping.
4. [x] The player should be able to move the dropping block left, right, and turn it. When the
   block reaches the bottom of the field, it should stop. No other features are required.
5. [ ] Pressing the Esc key should bring up a dialog box asking whether to end the game. Clicking
   "Yes" should return to the start-up page, "No" should continue the game.

## Future work:

Wire up:

1. [ ] Play button to load game screen and begin game;
2. [ ] Configuration to load modal and inject the configuration component
3. [x] High scores button to load modal and inject the high scores component


### Game Logic
1. [ ] Get the tetromino to start in the middle of the screen and fall
