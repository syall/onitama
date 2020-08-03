import { Piece } from './Piece.js';
import { PIECE, COLOR, SIDE_LENGTH } from './enums.js';

export class Board {

    static createGrid(length) {

        const grid = new Array(length);
        for (let row = 0; row < length; row++) {
            grid[row] = new Array(length);
            for (let col = 0; col < length; col++) {
                grid[row][col] = new Piece(PIECE.EMPTY);
            }
        }

        return grid;
    }

    static createBoard() {

        if (SIDE_LENGTH % 2 !== 1) {
            throw new Error(`Side Length must be Odd: ${SIDE_LENGTH}`);
        }

        const grid = Board.createGrid(SIDE_LENGTH);
        for (const row of [0, SIDE_LENGTH - 1]) {
            for (let col = 0; col < SIDE_LENGTH; col++) {
                const type = col === Math.floor(SIDE_LENGTH / 2)
                    ? PIECE.MASTER
                    : PIECE.STUDENT;
                const color = row === 0
                    ? COLOR.FALL
                    : COLOR.RISE;
                grid[row][col] = new Piece(type, color);
            }
        }

        return grid;
    }

    static createPattern(pattern, dir) {

        const length = 5;
        const grid = Board.createGrid(length);
        const offset = Math.floor(length / 2);
        grid[offset][offset] = new Piece(PIECE.CENTER);
        for (const [x, y] of pattern) {
            grid[offset - dir * y][offset + dir * x] = new Piece(PIECE.TARGET);
        }

        return grid;
    }

}
