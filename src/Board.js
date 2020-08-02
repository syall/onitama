const Piece = require('./Piece.js');
const { PIECE, COLOR } = require('./Enums.js');

class Board {

    static SIDE_LENGTH = 5;

    static createGrid(length = Board.SIDE_LENGTH) {
        const grid = new Array(length);
        for (let row = 0; row < length; row++) {
            grid[row] = new Array(length);
            for (let col = 0; col < length; col++)
                grid[row][col] = '  ';
        }
        return grid;
    }

    static stringGrid(grid) {

        const top = `┏━━${`┳━━`.repeat(grid.length - 1)}┓\n`;
        const inner = grid.map(o =>
            `┃${o.map(p => p.toString()).join('┃')}┃`)
            .join(`\n┣━━${`╋━━`.repeat(grid.length - 1)}┫\n`);
        const bottom = `\n┗━━${`┻━━`.repeat(grid.length - 1)}┛`;

        return `${top}${inner}${bottom}`;
    }

    constructor() {
        if (Board.SIDE_LENGTH % 2 !== 1)
            throw new Error(`Side Length must be Odd: ${Board.SIDE_LENGTH}`);
        this.grid = Board.createGrid();
        for (let row = 0; row < Board.SIDE_LENGTH; row++) {
            for (let col = 0; col < Board.SIDE_LENGTH; col++) {
                const noPieces = row !== 0 && row !== Board.SIDE_LENGTH - 1;
                const type = (
                    noPieces && PIECE.EMPTY ||
                    col === Math.floor(Board.SIDE_LENGTH / 2) && PIECE.MASTER ||
                    PIECE.STUDENT
                );
                const color = (
                    noPieces && COLOR.NULL ||
                    row === 0 && COLOR.FALL ||
                    COLOR.RISE
                );
                this.grid[row][col] = new Piece(type, color);
            }
        }
    }

    toString() {
        return Board.stringGrid(this.grid);
    }

}

module.exports = Board;
