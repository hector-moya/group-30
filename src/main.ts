
import { Board } from './app/Board';
import { GameConfig } from './app/GameConfig'
import './styles.scss'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div class="container flex flex-start items-start ha-c gg-2 py-5">
    <canvas id="board" class="bdr-red bdr-3"></canvas>
        <div id="play" class="btn primary">Play</div>	
    </div>
`


const setup = new GameConfig({ columns: 10, rows: 20, blockSize: 30});

const ctx = setup.getCanvasContext();

const board = new Board(ctx);



