import { AppLayout } from 'src/app/views/layouts/app-layout.component';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Canvas } from 'src/app/models/Canvas';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, AppLayout],
  template: `
    <app-layout [width]="'sm'">
        <div class="flex gg-2">
            <canvas #board class="bdr bdr-red"></canvas>
            <canvas #next class="bdr bdr-red"></canvas>
        </div>
    </app-layout>
    `
})
export class BoardComponent {

    @ViewChild('board', { static: true }) boardRef!: ElementRef;
    @ViewChild('next', { static: true }) nextRef!: ElementRef;

    board?: Canvas;
    next?: Canvas;
    ctx: CanvasRenderingContext2D | null = null;
    ctxNext: CanvasRenderingContext2D | null = null;

    ngOnInit(): void {
        this.boardInit();
        this.draw();
    }

    boardInit(): void {
        this.board = new Canvas(10, 5, this.boardRef.nativeElement, 30);
        this.next = new Canvas(5, 5, this.nextRef.nativeElement, 30);
        this.ctx = this.board.getContext();
        this.ctxNext = this.next.getContext();
    }

    draw() {
        this.ctx!.fillStyle = 'red';
        this.ctx!.fillRect(1, 1, 1, 1);
        this.ctxNext!.fillStyle = 'blue';
        this.ctxNext!.fillRect(1, 1, 1, 1);
    }
}
