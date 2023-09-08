import { AppLayout } from 'src/app/views/layouts/app-layout.component';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Canvas } from 'src/app/models/Canvas';

@Component({
    selector: 'app-board-new',
    standalone: true,
    imports: [CommonModule, AppLayout],
    template: `<canvas #canvas class="bdr bdr-red"></canvas>`,
})
export class BoardNewComponent {

    @ViewChild('canvas', { static: true }) boardRef!: ElementRef;

    board?: Canvas;
    ctx: CanvasRenderingContext2D | null = null;

    ngOnInit(): void {
        this.boardInit();
        this.draw();
    }

    boardInit(): void {
        this.board = new Canvas(10, 5, this.boardRef.nativeElement, 30);
        this.ctx = this.board.getContext();
    }

    draw() {
        this.ctx!.fillStyle = 'red';
        this.ctx!.fillRect(1, 1, 1, 1);
    }

}
