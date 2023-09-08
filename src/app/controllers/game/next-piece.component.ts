import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Canvas } from 'src/app/models/Canvas';


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

  ngOnInit(): void {
      this.nextPieceInit();
      this.draw();
  }

  nextPieceInit(): void {
      this.nextPiece = new Canvas(10, 5, this.nextPieceRef.nativeElement, 30);
      this.ctx = this.nextPiece.getContext();
  }

  draw() {
      this.ctx!.fillStyle = 'blue';
      this.ctx!.fillRect(2, 2, 2, 2);
  }

}
