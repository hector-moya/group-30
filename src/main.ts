
import { Board } from './app/Board';
import { GameConfig } from './app/GameConfig'
import { Piece } from './app/Piece';
import './styles.scss'

/**
 * Game configuration
 */
const setup = new GameConfig({ columns: 10, rows: 20, blockSize: 30 });

/**
 * Get the canvas context
 */
const ctx = setup.getCanvasContext();


let isPlaying = false;
document.getElementById('play')!.addEventListener('click', play);
document.getElementById('pause')!.addEventListener('click', pause);

/**
 * Create a new board passing the canvas context
 */
let board = new Board(ctx);


/**
 * Game movement controls
 * 
 */
const moves: any = {
    ArrowLeft: (p: Piece) => ({ ...p, x: p.x - 1 }),
    ArrowRight: (p: Piece) => ({ ...p, x: p.x + 1 }),
    ArrowDown: (p: Piece) => ({ ...p, y: p.y + 1 }),
    ArrowUp: (p: Piece) => board.rotate(p)
}

/**
 * Method to handle the game movement events
 * @param event The event object
 */
function handleMove(event: KeyboardEvent) {
    if (moves[event.key]) {
        event.preventDefault();
        let p = moves[event.key](board.piece);
        if (!board.isPieceOutOfBounds(p)) {
            board.piece.move(p);
        }
    }
}

/**
 * Method to handle the game play
 */

function play() {
    if (isPlaying) {
        stopInterval();
        reset();
        document.getElementById('play')!.textContent = 'Play'; // Change the text to "Play"
    } else {
        isPlaying = true;
        board.piece.render();
        document.addEventListener('keydown', handleMove);
        document.getElementById('play')!.textContent = 'Reset'; // Change the text to "Reset"
        handleInterval();
    }

}

/**
 * Method to reset the game
 */
function reset() {
    isPlaying = false;
    board.piece.clear();
    board = new Board(ctx); // Create a new Board object
}

/**
 * Method to handle the interval
 * @param interval The interval
 */

let interval: number | undefined; // Variable to hold the interval

function handleInterval(time: number = 500) {
    if (isPlaying) {
        interval = setInterval(() => {
            let p = moves['ArrowDown'](board.piece);
            if (!board.isPieceOutOfBounds(p)) {                
                board.drawStatic();
                board.piece.move(p);
            } else {
                board.merge(board.piece);
                board.clearLines();
                board.piece = new Piece(ctx);
            }
            
        }, time);
    }
}

/**
 * Method to stop the interval
 */

function stopInterval() {
    if (interval) {
        clearInterval(interval);
        interval = undefined;
    }
    
}

/**
 * Method to handle stopping the game if `pause` is clicked
 */
function pause() {
    console.log('pause');
    stopInterval();
    reset();
    document.removeEventListener('keydown', handleMove);
}




