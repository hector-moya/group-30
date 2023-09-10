export interface IConfig {
    rows: number;
    columns: number;
    blockSize: number;
    extended: boolean;
    startLevel: number;
    nextGridSize?: number;
}
