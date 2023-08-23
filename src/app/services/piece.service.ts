import { Injectable } from '@angular/core';
import { TETROMINOS, EXT_TETROMINOS } from '../data';
import { Tetromino } from '../defs';
import { Piece } from '../models/Piece';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';
import { GameConfigService } from './game-config.service';

@Injectable({
    providedIn: 'root'
})

export class PieceService {


    /**
     * BehaviorSubject to hold and broadcast the current Piece
     * @private
     */
    private pieceSubject: BehaviorSubject<Piece | null> = new BehaviorSubject<Piece | null>(this.piece!)

    /**
     * The current piece instance
     */
    private piece?: Piece;

    // Inject the GameConfigService
    constructor(private gameConfigService: GameConfigService) { }

    /**
     * Get the observable that emits the current Piece
     * 
     * @returns {Observable<Piece | null>} An observable of the current Piece
     */
    getPieceObservable(): Observable<Piece | null> {
        return this.pieceSubject.asObservable();
    }

    /**
     * Set the current Piece and notify subscribers
     * 
     * @param piece 
     */
    setCurrentPiece(piece: Piece): void {
        this.piece = piece;
        this.pieceSubject.next(piece);
    }

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

    moveLeft(): void {
        this.move('left', -1, 0);
      }
    
      moveRight(): void {
        this.move('right', 1, 0);
      }
    
      moveDown(): void {
        this.move('down', 0, 1);
      }

    moveUp(): void {
        this.piece!.rotate();
    }

    /**
     * Move the current piece in the specified direction
     * Get the current game configuration and check if the piece is out of bounds
     * @param direction 
     * @param dx 
     * @param dy 
     */
    private move(direction: 'left' | 'right' | 'down', dx: number, dy: number): void {
        this.gameConfigService.getConfigObservable().subscribe((config) => {
          if (this.piece && !this.piece.isOutOfBounds(config.rows, config.columns, dx, dy)) {
            switch (direction) {
              case 'left': this.piece.moveLeft(); break;
              case 'right': this.piece.moveRight(); break;
              case 'down': this.piece.moveDown(); break;
            }
          }
        });
      }

    /**
      * Get a random Tetromino object
      *
      * @param {boolean} extended - Whether to include extended Tetrominos
      * @returns {Tetromino} A randomly selected Tetromino object
      */
    private getRandomTetromino(extended: boolean = false): Tetromino {
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
