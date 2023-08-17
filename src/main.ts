
import { Board } from './app/Board';
import { GameConfig } from './app/GameConfig'
import { Piece } from './app/Piece';
import './styles.scss'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div class="container flex flex-start items-start ha-c gg-2 py-5">
    <canvas id="board" class="bdr-red bdr-3"></canvas>
        <div id="play" class="btn primary">Play</div>	
    </div>
`

/**
 * Game configuration
 */
const setup = new GameConfig({ columns: 10, rows: 20, blockSize: 30 });

/**
 * Get the canvas context
 */
const ctx = setup.getCanvasContext();


/**
 * Create a new board passing the canvas context
 */
let board = new Board(ctx);

board.piece.render();

/**
 * Event listener for the play button
 */

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
 * Event listener for the game movement
 */
document.addEventListener('keydown', handleMove);
