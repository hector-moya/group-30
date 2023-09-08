import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Canvas } from 'src/app/models/Canvas';
import { PieceService } from 'src/app/services/piece.service';
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

  nextPiece?: Canvas;
  ctx: CanvasRenderingContext2D | null = null;
  private pieceService = inject(PieceService);
  private piece: Piece | null = null;

  ngOnInit(): void {
      this.init();
      this.getPiece();
      this.pieceService.moveDown();
  }

  init(): void {
      this.nextPiece = new Canvas(10, 5, this.nextPieceRef.nativeElement, 30);
      this.ctx = this.nextPiece.getContext();
  }  

  getPiece(): void {
    this.piece = this.pieceService.getPiece(this.ctx!);
    this.pieceService.setCurrentPiece(this.piece, 'next'); // Set the current piece in the service
}
  /**
   * Subscribe to the Piece updates from the PieceService.
   * When the Piece changes, the callback function is triggered.
   * This is where we will render the Piece.
   *
   */
  subscribeToPiece(): void {
      this.pieceService.getNextPieceObservable().subscribe((piece: Piece | null) => {
        this.piece = piece; 
      });
    }

}
