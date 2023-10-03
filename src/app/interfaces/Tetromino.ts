import { Matrix } from "../defs";

export interface ITetromino {
    id?: number;
    shape: Matrix;
    color: string;
}
