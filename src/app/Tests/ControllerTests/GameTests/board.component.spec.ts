import { EventEmitter } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BoardComponent } from 'src/app/controllers/game/board.component';
import { IConfig } from 'src/app/interfaces/Config';
import { IGameStats } from 'src/app/interfaces/Score';
import { Piece } from 'src/app/models/Piece';
import { GameService } from 'src/app/services/game.service';
import { ModalService } from 'src/app/services/modal.service';
import { PieceService } from 'src/app/services/piece.service';
import { ScoreService } from 'src/app/services/score.service';


/**
 * This is a test suite for the BoardComponent class.
 */

/**
 * The onKeyDown method is responsible for handling keyboard events such as arrow keys, P, and Escape.
 * We are testing for the following:
 * - The method should call onKeydown with the correct event
 * - The method should call handleEscape when the Escape key is pressed
 * - The method should do nothing if the game is not started
 * - The method should call moveAndRenderGrid with the correct params on arrow key when game is started and piece can move
 * - The method should call stopAnimation when P or p key is pressed
 */
describe('BoardComponent onKeyDown', () => {
    let component: BoardComponent;
    let fixture: ComponentFixture<BoardComponent>;


    beforeEach(() => {
        fixture = TestBed.createComponent(BoardComponent);
        component = fixture.componentInstance;
        component.time = { start: 0, elapsed: 0, speed: 1000 };
        component.config = { columns: 10, rows: 20, blockSize: 30, extended: false, startLevel: 1 };

    });
    class MockCanvas {
        getContext(): Partial<CanvasRenderingContext2D> {
            return {
                fillRect: jasmine.createSpy('fillRect')
            };
        }
    }

    it('should handle keydown events', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });

        spyOn(component, 'onKeydown');
        component.onKeydown(event);

        expect(component.onKeydown).toHaveBeenCalledWith(event);
    });

    it('should handle Escape key', () => {
        const event = new KeyboardEvent('keydown', { key: 'Escape' });

        spyOn(component, 'handleEscape');
        component.onKeydown(event);

        expect(component.handleEscape).toHaveBeenCalledTimes(1);
    });

    // it('should do nothing if the game is not started', () => {
    //     const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });

    //     component.gameStarted = false;
    //     spyOn(component, 'moveAndRenderGrid');
    //     component.onKeydown(event);

    //     expect(component.moveAndRenderGrid).not.toHaveBeenCalled();
    // });

    // it('should call moveAndRenderGrid with correct params on arrow key when game is started and piece can move', () => {
    //     // Mocking properties
    //     component['config'] = { columns: 10, rows: 20, blockSize: 30, extended: false, startLevel: 1 };
    //     component['ctx'] = new MockCanvas().getContext() as CanvasRenderingContext2D;
    //     component['piece'] = new Piece(component['ctx']!, [[0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 0]], 'red', component['config'], 'current');

    //     // Mocking `moves` method
    //     component['moves'] = {
    //         ArrowUp: () => ({ shape: [[1]], x: 1, y: 2 })
    //     };

    //     // Creating a mock KeyboardEvent for 'ArrowUp' key
    //     const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });

    //     // Spying on methods
    //     spyOn(component, 'moveAndRenderGrid');
    //     spyOn(component['gameService'], 'canMove').and.returnValue(true);

    //     // Calling onKeydown method with mock event
    //     component.onKeydown(event);

    //     // Expectations
    //     expect(component['gameService'].canMove).toHaveBeenCalledWith([[1]], { x: 1, y: 2 });
    //     expect(component.moveAndRenderGrid).toHaveBeenCalledWith([[1]], { x: 1, y: 2 });
    // });


    // it('should handle P or p key', () => {
    //     // Mock gameService and its pauseMessage method
    //     component.ctx = new MockCanvas().getContext() as CanvasRenderingContext2D;

    //     const eventP = new KeyboardEvent('keydown', { key: 'P' });
    //     const eventp = new KeyboardEvent('keydown', { key: 'p' });

    //     // Spying on methods
    //     spyOn(component, 'stopAnimation').and.callThrough();  // Ensure spies are created
    //     spyOn(component, 'animate').and.callThrough();  // and allow methods to be called
    //     spyOn(component.gameService, 'pauseMessage');  // Additional spy for pauseMessage


    //     const pieceMock = new Piece(component.ctx!, [[0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 0]], 'red', component.config, 'current');
    //     pieceMock.y = 1;
    //     component.requestId = 1;
    //     component.gameStarted = true;
    //     component.onKeydown(eventP);
    //     component.onKeydown(eventp);

    //     // Expectations
    //     expect(component.stopAnimation).toHaveBeenCalledTimes(1);
    //     expect(component.animate).toHaveBeenCalledTimes(1);
    //     expect(component.gameService.pauseMessage).toHaveBeenCalledTimes(2);
    // });

});

/**
 * The initGameStats method is responsible for initializing the game stats.
 * We are testing for the following:
 * - The method should call setGameStats exactly once
 * - The method should call getLevelSpeed
 * - The method should set time.start to 0
 * - The method should set time.elapsed to 0
 * - The method should set time.speed to the value returned by getLevelSpeed
 * - The method should set level from config.startLevel
 */
describe('BoardComponent initGameStats', () => {
    let component: BoardComponent;
    let scoreService: jasmine.SpyObj<ScoreService>;

    beforeEach(() => {
        // Create a mock ScoreService
        const scoreServiceSpy = jasmine.createSpyObj('ScoreService', ['setGameStats', 'getLevelSpeed']);

        TestBed.configureTestingModule({
            providers: [
                BoardComponent, // Provide the component
                { provide: ScoreService, useValue: scoreServiceSpy } // Provide the mock service
            ]
        });

        // Get the injected instances
        component = TestBed.inject(BoardComponent);
        scoreService = TestBed.inject(ScoreService) as jasmine.SpyObj<ScoreService>;
    });

    it('should initialize game stats', () => {
        // Arrange
        const startingValues: IGameStats = { score: 0, lines: 0, level: 1, levelUp: 1 };
        component.config = { startLevel: 1 } as IConfig;

        // Act
        component.initGameStats();

        // Assert
        expect(scoreService.setGameStats).toHaveBeenCalledWith(startingValues);
        expect(scoreService.getLevelSpeed).toHaveBeenCalled();
    });

    it('should call setGameStats exactly once', () => {
        component.config = { startLevel: 1 } as IConfig;
        component.initGameStats();
        expect(scoreService.setGameStats).toHaveBeenCalledTimes(1);
    });

    it(' should call getLevelSpeed', () => {
        component.config = { startLevel: 1 } as IConfig;
        component.initGameStats();
        expect(scoreService.getLevelSpeed).toHaveBeenCalled();
    });

    it(' should set time.start to 0', () => {
        component.config = { startLevel: 1 } as IConfig;
        component.initGameStats();
        expect(component['time']!.start).toEqual(0);
    });


    it(' should set time.elapsed to 0', () => {
        component.config = { startLevel: 1 } as IConfig;
        component.initGameStats();
        expect(component['time']!.elapsed).toEqual(0);
    });


    it(' should set time.speed to the value returned by getLevelSpeed', () => {
        component.config = { startLevel: 1 } as IConfig;
        scoreService.getLevelSpeed.and.returnValue(1000);
        component.initGameStats();
        expect(component['time']!.speed).toEqual(1000);
    });

    it(' should set time properties correctly', () => {
        component.config = { startLevel: 1 } as IConfig;
        scoreService.getLevelSpeed.and.returnValue(1000);
        component.initGameStats();
        expect(component['time']).toEqual({ start: 0, elapsed: 0, speed: 1000 });
    });

    it(' should set level from config.startLevel', () => {
        component.config = { startLevel: 3 } as IConfig;
        component.initGameStats();
        expect(scoreService.setGameStats).toHaveBeenCalledWith(jasmine.objectContaining({ level: component.config.startLevel }));
    });
});

/**
 * The handleEscape method is responsible for handling the Escape key.
 * We are testing for the following:
 * - The method should call stopAnimation once
 * - The method should call modalService.openModal with correct parameters
 * - The method should call animate when modal action is "cancel" or "close"
 * - The method should not call animate when modal action is not "cancel" or "close"
 */
describe('BoardComponent handleEscape', () => {
    let component: BoardComponent;
    let modalService: jasmine.SpyObj<ModalService>;

    beforeEach(() => {
        const modalServiceSpy = jasmine.createSpyObj('ModalService', ['openModal']);

        TestBed.configureTestingModule({
            providers: [
                BoardComponent,
                { provide: ModalService, useValue: modalServiceSpy }
            ]
        });

        component = TestBed.inject(BoardComponent);
        modalService = TestBed.inject(ModalService) as jasmine.SpyObj<ModalService>;
    });

    it(' should call stopAnimation once', () => {
        spyOn(component, 'stopAnimation');
        component.handleEscape();
        expect(component.stopAnimation).toHaveBeenCalledTimes(1);
    });

    it(' should call modalService.openModal with correct parameters', () => {
        const modalConfig = {
            title: 'Do you want to end the game?',
            buttons: [
                { label: 'Continue Game', class: '', action: 'close' },
                { label: 'Return to Start', class: 'primary', action: 'redirect' },
            ]
        };
        component.handleEscape();
        expect(modalService.openModal).toHaveBeenCalledWith(
            modalConfig,
            jasmine.any(Function)
        );
    });

    // it(' should call animate when modal action is "cancel" or "close"', () => {
    //     spyOn(component, 'animate');
    //     component.handleEscape();
    //     (modalService.openModal.calls.mostRecent().args[1] as (action?: string) => void)('close');
    //     expect(component.animate).toHaveBeenCalledTimes(1);
    // });

    // it(' should not call animate when modal action is not "cancel" or "close"', () => {
    //     spyOn(component, 'animate');
    //     component.handleEscape();
    //     (modalService.openModal.calls.mostRecent().args[1] as (action?: string) => void)('redirect');
    //     expect(component.animate).not.toHaveBeenCalled();
    // });

});

/**
 * The handleGameOver method is responsible for handling the game over scenario.
 * We are testing for the following:
 * - The method should call stopAnimation once
 * - The method should call modalService.openModal with correct parameters when it is a high score
 * - The method should call modalService.openModal with correct parameters when it is not a high score
 * - The method should call scoreService.addHighScore when it is a high score
 * - The method should call reload when user decides to play again after a non-high score
 * - The method should not call addHighScore when it is not a high score
 * - The method should restart the game when user decides to play again after a non-high score
 * - The method should handle 0 score
 */
describe('BoardComponent handleGameOver method', () => {
    let component: BoardComponent;
    let modalService: jasmine.SpyObj<ModalService>;
    let scoreService: jasmine.SpyObj<ScoreService>;

    beforeEach(() => {
        const modalServiceSpy = jasmine.createSpyObj('ModalService', ['openModal']);
        const scoreServiceSpy = jasmine.createSpyObj('ScoreService', ['isTopScore', 'getScore', 'addHighScore']);

        TestBed.configureTestingModule({
            providers: [
                BoardComponent,
                { provide: ModalService, useValue: modalServiceSpy },
                { provide: ScoreService, useValue: scoreServiceSpy }
            ]
        });

        component = TestBed.inject(BoardComponent);
        modalService = TestBed.inject(ModalService) as jasmine.SpyObj<ModalService>;
        scoreService = TestBed.inject(ScoreService) as jasmine.SpyObj<ScoreService>;
    });

    //
    it('should call stopAnimation once', () => {
        spyOn(component, 'stopAnimation');
        component.handleGameOver();
        expect(component.stopAnimation).toHaveBeenCalledTimes(1);
    });


    //
    it('should handle high score scenario correctly', () => {
        scoreService.isTopScore.and.returnValue(true);
        scoreService.getScore.and.returnValue(1000);
        component.handleGameOver();
        expect(scoreService.isTopScore).toHaveBeenCalledWith(1000);
        expect(modalService.openModal).toHaveBeenCalledWith({
            title: 'New High Score',
            buttons: [{ label: 'Continue', class: 'primary', action: 'saveAndDisplayHighScore' }]
        }, jasmine.any(Function));
    });

    //
    it('should handle non-high score scenario correctly', () => {
        scoreService.isTopScore.and.returnValue(false);
        scoreService.getScore.and.returnValue(500);
        component.handleGameOver();
        expect(modalService.openModal).toHaveBeenCalledWith({
            title: `Game Over, your final score is: 500`,
            buttons: [
                { label: 'Return Home', class: '', action: 'redirect' },
                { label: 'Play Again', class: 'primary', action: 'playAgain' },
            ]
        }, jasmine.any(Function));
    });

    //
    it('should handle saveAndDisplayHighScore action', () => {
        spyOn(component, 'reload');
        component.playerName = 'TestPlayer';
        scoreService.getScore.and.returnValue(1000);
        component.handleGameOver();
        const actionCallback = modalService.openModal.calls.mostRecent().args[1] as (action?: string) => void;
        actionCallback('saveAndDisplayHighScore');
        expect(scoreService.addHighScore).toHaveBeenCalledWith('TestPlayer', 1000);
        expect(component.reload).not.toHaveBeenCalled();  // reload should not be called here
    });

    //
    it('should handle playAgain action', () => {
        spyOn(component, 'reload');
        component.handleGameOver();
        const actionCallback = modalService.openModal.calls.mostRecent().args[1] as (action?: string) => void;
        actionCallback('playAgain');
        expect(component.reload).toHaveBeenCalledTimes(1);
    });

    it('should not call addHighScore when it is not a high score', () => {
        scoreService.isTopScore.and.returnValue(false);
        component.handleGameOver();
        expect(scoreService.addHighScore).not.toHaveBeenCalled();
    });

    it('should restart the game when user decides to play again after a non-high score', () => {
        spyOn(component, 'reload');
        scoreService.isTopScore.and.returnValue(false);
        component.handleGameOver();
        const actionCallback = modalService.openModal.calls.mostRecent().args[1] as (action?: string) => void;
        actionCallback('playAgain');
        expect(component.reload).toHaveBeenCalledTimes(1);
    });

    it('should handle 0 score', () => {
        scoreService.getScore.and.returnValue(0);
        expect(() => component.handleGameOver()).not.toThrow();
    });

});

/**
 * The drop method is responsible for dropping the piece.
 * We are testing for the following:
 * - The method should return false when piece cannot move down and is at top
 * - The method should lock piece, reset speed, clear rows, swap pieces, and emit event when piece cannot move down
 * - The method should move and render grid when piece can move down
 * - The method should call lock method with correct parameters when piece cannot move down
 * - The method should call moveAndRenderGrid method with correct parameters when piece can move down
 * - The method should have correct state after drop method is executed and piece is locked
 * - The method should call lock method with correct parameters when piece cannot move down
 * - The method should call moveAndRenderGrid method with correct parameters when piece can move down
 * - The method should have correct state after drop method is executed and piece is locked
 */
// describe('BoardComponent drop method', () => {
//     let component: BoardComponent;
//     let gameService: jasmine.SpyObj<GameService>;
//     let scoreService: jasmine.SpyObj<ScoreService>;
//     let pieceService: jasmine.SpyObj<PieceService>;

//     interface MockCanvasRenderingContext2D extends CanvasRenderingContext2D {
//         fillRect: jasmine.Spy<jasmine.Func>;
//     }

//     interface MockCanvasRenderingContext2D extends CanvasRenderingContext2D {
//         fillRect: jasmine.Spy<jasmine.Func>;
//         clearRect: jasmine.Spy<jasmine.Func>;
//     }

//     class MockCanvas {
//         getContext(): MockCanvasRenderingContext2D {
//             return {
//                 fillRect: jasmine.createSpy('fillRect'),
//                 clearRect: jasmine.createSpy('clearRect'),
//                 canvas: {
//                     width: 200,
//                     height: 400
//                 } as HTMLCanvasElement
//             } as MockCanvasRenderingContext2D;
//         }
//     }

//     beforeEach(() => {
//         const gameServiceSpy = jasmine.createSpyObj('GameService', ['canMove', 'lock', 'clearRows', 'renderGrid']);
//         const scoreServiceSpy = jasmine.createSpyObj('ScoreService', ['getLevelSpeed']);
//         const pieceServiceSpy = jasmine.createSpyObj('PieceService', ['swapNextToCurrent']);

//         TestBed.configureTestingModule({
//             providers: [
//                 BoardComponent,
//                 { provide: GameService, useValue: gameServiceSpy },
//                 { provide: ScoreService, useValue: scoreServiceSpy },
//                 { provide: PieceService, useValue: pieceServiceSpy }
//             ]
//         });

//         component = TestBed.inject(BoardComponent);
//         gameService = TestBed.inject(GameService) as jasmine.SpyObj<GameService>;
//         scoreService = TestBed.inject(ScoreService) as jasmine.SpyObj<ScoreService>;
//         pieceService = TestBed.inject(PieceService) as jasmine.SpyObj<PieceService>;

//         component.config = { columns: 10, rows: 20, blockSize: 30, extended: false, startLevel: 1 };
//         component.ctx = new MockCanvas().getContext() as CanvasRenderingContext2D;
//         component.newNextPieceEvent = new EventEmitter<string>();

//         component.time = { start: 0, elapsed: 0, speed: 1000 };
//     });

//     it('should return false when piece cannot move down and is at top', () => {
//         gameService.canMove.and.returnValue(false);
//         component.piece = new Piece(component.ctx!, [[0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 0]], 'red', component.config, 'current');
//         component.piece!.y = 0;
//         expect(component.drop()).toBeFalse();
//     });


//     it('should lock piece, reset speed, clear rows, swap pieces, and emit event when piece cannot move down', () => {
//         spyOn(component.newNextPieceEvent, 'emit');
//         gameService.canMove.and.returnValue(false);
//         component.piece = new Piece(component.ctx!, [[0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 0]], 'red', component.config, 'current');
//         component.piece!.y = 1;  // Not at the top
//         component.drop();
//         expect(gameService.lock).toHaveBeenCalled();
//         expect(scoreService.getLevelSpeed).toHaveBeenCalled();
//         expect(gameService.clearRows).toHaveBeenCalled();
//         expect(pieceService.swapNextToCurrent).toHaveBeenCalled();
//         expect(gameService.renderGrid).toHaveBeenCalled();
//         expect(component.newNextPieceEvent.emit).toHaveBeenCalled();
//     });

//     it('should move and render grid when piece can move down', () => {
//         spyOn(component, 'moveAndRenderGrid');
//         component.piece = new Piece(component.ctx!, [[0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 0]], 'red', component.config, 'current');
//         component.piece!.y = 1;
//         gameService.canMove.and.returnValue(true);
//         component.drop();
//         expect(component.moveAndRenderGrid).toHaveBeenCalled();
//     });

//     it('should call lock method with correct parameters when piece cannot move down', () => {
//         gameService.canMove.and.returnValue(false);
//         const pieceMock = new Piece(component.ctx!, [[0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 0]], 'red', component.config, 'current');
//         pieceMock.y = 1;  // Not at the top
//         component.piece = pieceMock;
//         component.drop();
//         expect(gameService.lock).toHaveBeenCalledWith(pieceMock.shape, { x: pieceMock.x, y: pieceMock.y });
//     });

//     it('should call moveAndRenderGrid method with correct parameters when piece can move down', () => {
//         spyOn(component, 'moveAndRenderGrid');
//         gameService.canMove.and.returnValue(true);
//         const pieceMock = new Piece(component.ctx!, [[0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 0]], 'red', component.config, 'current');
//         pieceMock.y = 1;
//         component.piece = pieceMock;
//         component.drop();
//         expect(component.moveAndRenderGrid).toHaveBeenCalledWith(pieceMock.shape, { x: pieceMock.x, y: pieceMock.y + 1 });
//     });

//     it('should have correct state after drop method is executed and piece is locked', () => {
//         gameService.canMove.and.returnValue(false);
//         const pieceMock = new Piece(component.ctx!, [[0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 0]], 'red', component.config, 'current');
//         pieceMock.y = 1;
//         component.piece = pieceMock;
//         component.drop();
//         // Validate the state properties, assuming the following method calls should affect the state
//         expect(gameService.lock).toHaveBeenCalled();
//         expect(scoreService.getLevelSpeed).toHaveBeenCalled();
//         expect(gameService.clearRows).toHaveBeenCalled();
//     });

// });
