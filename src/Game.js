const Deck = require('./Deck.js');
const Player = require('./Player.js');
const Piece = require('./Piece.js');
const { createGrid, stringGrid, SIDE_LENGTH } = require('./Board.js');
const { PIECE, COLOR, STATUS, CARDS } = require('./Enums.js');

class Game {

    CARD_PER_PLAYER = 2;
    TOTAL_CARDS = 2 * this.CARD_PER_PLAYER + 1;

    constructor(board, emit = console.log) {
        this.board = board;
        this.emit = emit;
        const cards = new Deck().deal(this.TOTAL_CARDS);
        this[COLOR.RISE] = new Player(COLOR.RISE, cards.slice(0, this.CARD_PER_PLAYER));
        this.swap = cards[this.CARD_PER_PLAYER];
        this[COLOR.FALL] = new Player(COLOR.FALL, cards.slice(this.CARD_PER_PLAYER + 1));
        this.current = this[COLOR.RISE];
        this.opposite = this[COLOR.FALL];
        this.togglePlayer();
        this.status = STATUS.CURRENT;
    }

    turn() {
        this.emit(`${this.current.color} Player's Turn`);
        this.emit(`Swap Card: ${this.swap}`);
        this.emit(this[COLOR.FALL].toString());
        this.emit(this.board.toString());
        this.emit(this[COLOR.RISE].toString());
    }

    final() {
        this.emit(`Swap Card: ${this.swap}`);
        this.emit(this[COLOR.FALL].toString());
        this.emit(this.board.toString());
        this.emit(this[COLOR.RISE].toString());
    }

    pattern(name) {

        const pattern = CARDS.get(name);
        if (!pattern)
            return `Invalid Card: ${name}`;

        const length = 5;
        const grid = createGrid(length);
        const offset = Math.floor(length / 2);
        grid[offset][offset] = '()';
        const dir = this.current === this[COLOR.RISE] ? 1 : -1;
        for (const [x, y] of pattern) {
            const newX = offset - (dir * y);
            const newY = offset + (dir * x);
            grid[newX][newY] = '<>';
        }

        return stringGrid(grid);
    }

    move(rawStart, rawEnd, card) {

        if (!CARDS.has(card) || !this.current.cards.includes(card))
            return [`Invalid Card: ${card}`, null];

        const [rsRow, rsCol] = rawStart
            .toUpperCase()
            .match(/^([a-zA-Z])(\d)$/).slice(1, 3);
        const [reRow, reCol] = rawEnd
            .toUpperCase()
            .match(/^([a-zA-Z])(\d)$/).slice(1, 3);

        const sRow = rsRow.charCodeAt(0) - 65;
        const sCol = rsCol - 1;
        if (sRow < 0 || sRow >= SIDE_LENGTH ||
            sCol < 0 || sCol >= SIDE_LENGTH)
            return [`Invalid Start: ${rawStart}`, null];

        const start = this.board.grid[sRow][sCol];
        if (start.color !== this.current.color)
            return [`Invalid Start: ${rawStart}`, null];

        const eRow = reRow.charCodeAt(0) - 65;
        const eCol = reCol - 1;
        if (eRow < 0 || eRow >= SIDE_LENGTH ||
            eCol < 0 || eCol >= SIDE_LENGTH)
            return [`Invalid End: ${rawEnd}`, null];

        const end = this.board.grid[eRow][eCol];
        if (end.color === this.current.color)
            return [`Invalid End: ${rawEnd}`, null];

        const dir = this.current === this[COLOR.RISE] ? 1 : -1;
        let possible = false;
        for (const [x, y] of CARDS.get(card)) {
            const newX = sRow - (dir * y);
            const newY = sCol + (dir * x);
            if (newX === eRow && newY === eCol) {
                possible = true;
                break;
            }
        }
        if (!possible)
            return [`Invalid Move: ${rawStart} to ${rawEnd}`, null];

        this.board.grid[eRow][eCol] = start;
        this.board.grid[sRow][sCol] = new Piece(PIECE.EMPTY, COLOR.NULL);

        const swap = this.swap;
        this.current.cards = this.current.cards.filter(c => c !== card);
        this.swap = card;
        this.current.cards.push(swap);

        const type = start.type;
        const move = `from ${rsRow}${rsCol} to ${reRow}${reCol}`;
        return [null, `${type} moved ${move} with ${card}`];
    }

    pass(cardToPass) {

        if (!CARDS.has(cardToPass) || !this.current.cards.includes(cardToPass))
            return [`Invalid Card: ${cardToPass}`, null];

        for (let row = 0; row < SIDE_LENGTH; row++) {
            for (let col = 0; col < SIDE_LENGTH; col++) {
                const { color } = this.board.grid[row][col];
                if (this.current.color !== color)
                    continue;
                const dir = this.current === this[COLOR.RISE] ? 1 : -1;
                for (const card of this.current.cards) {
                    for (const [x, y] of CARDS.get(card)) {
                        const newX = row - (dir * y);
                        const newY = col + (dir * x);
                        if (newX < 0 || newX >= SIDE_LENGTH ||
                            newY < 0 || newY >= SIDE_LENGTH)
                            continue;
                        const end = this.board.grid[newX][newY];
                        if (end.color !== this.current.color)
                            return [`Invalid Pass`, null];
                    }
                }
            }
        }

        const swap = this.swap;
        this.current.cards = this.current.cards.filter(c => c !== cardToPass);
        this.swap = cardToPass;
        this.current.cards.push(swap);

        return [null, `Pass with ${cardToPass}`];

    }

    isNotDone() {

        // Way of the Stone
        let stone = !this.board.grid.some(r => r.some(({ type, color }) =>
            type === PIECE.MASTER && color === this.opposite.color));
        if (stone) {
            this.status = this.current === this[COLOR.RISE]
                ? STATUS.RISEWIN
                : STATUS.FALLWIN;
            return false;
        }

        // Way of the Stream
        const templeRow = this.current.color === COLOR.RISE ? 0 : SIDE_LENGTH - 1;
        const templeCol = Math.floor(SIDE_LENGTH / 2);
        const { type, color } = this.board.grid[templeRow][templeCol];
        const stream = type === PIECE.MASTER && color === this.current.color;
        if (stream) {
            this.status = this.current === this[COLOR.RISE]
                ? STATUS.RISEWIN
                : STATUS.FALLWIN;
            return false;
        }

        return this.status === STATUS.CURRENT;
    }

    togglePlayer() {
        const current = this.current;
        const opposite = this.current === this[COLOR.RISE]
            ? this[COLOR.FALL]
            : this[COLOR.RISE];
        this.current = opposite;
        this.opposite = current;
    }

    surrender() {
        this.status = this.current === this[COLOR.RISE]
            ? STATUS.RISESURRENDER
            : STATUS.FALLSURRENDER;
    }

}

module.exports = Game;
