import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { GameConfigService } from 'src/app/services/game-config.service';
import { PieceService } from 'src/app/services/piece.service';
import { IConfig } from 'src/app/models/GameConfig';
import { CommonModule } from '@angular/common';
import { Canvas } from 'src/app/models/Canvas';
import { Piece } from 'src/app/models/Piece';


@Component({
    selector: 'app-next-piece',
    standalone: true,
    imports: [CommonModule],
    template: `<canvas #canvas class="bdr bdr-red"></canvas>`,
    styles: [
    ]
})
export class NextPieceComponent {

    @ViewChild('canvas', { static: true }) nextPieceRef!: ElementRef;

    ctx!: CanvasRenderingContext2D | null;
    private nextPiece!: Piece | null;

    private configService = inject(GameConfigService);
    private pieceService = inject(PieceService);

    ngOnInit(): void {
        this.init();
    }

    /**
      * Subscribe to the configuration updates from the ConfigService and
      * initialize the canvas.
      */
    private init(): void {
        this.configService.getConfigObservable().subscribe((config: IConfig) => {
            // Instantiate the canvas and set the context
            const { blockSize } = config
            const board = new Canvas(5, 5, this.nextPieceRef.nativeElement, blockSize);
            this.ctx = board.getContext();
            this.getPiece();


        });
    }

    getPiece(): void {
        // console.log(this.pieceService.getPiece(this.ctx!));
        ;
        // this.pieceService.setPiece(this.piece, 'next'); // Set the current piece in the service
    }


}
