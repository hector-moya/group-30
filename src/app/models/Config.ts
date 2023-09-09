export interface IConfig {
    rows: number;
    columns: number;
    blockSize: number;
    extended: boolean;
    startLevel: number;
    nextRows?: number;
    nextColumns?: number;
}
