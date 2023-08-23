import { Injectable } from '@angular/core';
import { TETROMINOS, EXT_TETROMINOS } from '../data';
import { Tetromino } from '../defs';
import { Piece } from '../models/Piece';

@Injectable({
    providedIn: 'root'
})

export class PieceService {

    /**
       * Generates a new Piece with a random Tetromino and returns it.
       *
       * @param {CanvasRenderingContext2D} ctx - The 2D rendering context for the canvas.
       * @returns {Piece} A newly generated Piece instance.
       */
    getPiece(ctx: CanvasRenderingContext2D): Piece {
        const randomTetromino = this.getRandomTetromino(false);
        return new Piece(ctx, randomTetromino);
    }

    /**
      * Get a random Tetromino object
      *
      * @param {boolean} extended - Whether to include extended Tetrominos
      * @returns {Tetromino} A randomly selected Tetromino object
      */
    getRandomTetromino(extended: boolean = false): Tetromino {
        const shapes = this.getGameShapes(extended);
        const shapeKeys = Object.keys(shapes);
        const randomIndex = Math.floor(Math.random() * shapeKeys.length);
        let randomShapeKey = shapeKeys[randomIndex];
        return shapes[randomShapeKey];
    }

    /**
     * Get the available Tetromino shapes based on the game mode
     *
     * @param {boolean} extended - Whether to include extended Tetrominos
     * @returns {Object.<string, Tetromino>} An object containing the available Tetromino shapes
     */
    private getGameShapes(extended: boolean): { [key: string]: Tetromino } {
        return extended ? { ...TETROMINOS, ...EXT_TETROMINOS } : { ...TETROMINOS };
    }
}
