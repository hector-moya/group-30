## Game Grid

- Create a grid which represents that game board state.
- The grid should contain multiple tetrominos which should display it's own color.
- Make sure several rows are filled with values.
- On event, clear each completed row of tetrominos and move the rows above it down.

## Lock a piece in place, switch from to next current and create a new next piece
- Create a method which switches the current tetromino with the next tetromino.
- When the current tetromino hits the bottom, the next tetromino should be displayed on the grid, and a new tetromino should be generated as the next tetromino.

<a id="markdown-remembering-the-state-of-the-grid" name="remembering-the-state-of-the-grid"></a>

## Remembering the state of the grid
- Create a method which remembers the state of the grid.
- When the current tetromino hits the bottom, the state of the grid should be remembered.



## Create a reusable function for

```js
matrix.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
        if (value > 0) {
            // different actions need to be handled here
        }
    });
});
```

## Get a Tetromino to rotate on the spot at the highest point
