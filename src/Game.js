import { Deck } from './Deck.js';
import { Player } from './Player.js';
import { Piece } from './Piece.js';
import { Board } from './Board.js';
import {
    PIECE, COLOR, STATUS, CARDS, SIDE_LENGTH, CARDS_PER_PLAYER, EMIT, ARGS
} from './enums.js';
import { normalize } from './utils.js';

export class Game {

    CARD_PER_PLAYER = CARDS_PER_PLAYER;
    TOTAL_CARDS = 2 * this.CARD_PER_PLAYER + 1;

    constructor(emitter) {

        // Arguments
        this.board = Board.createBoard();
        this.emitter = emitter;

        // Cards
        if (this.TOTAL_CARDS > CARDS.size) {
            throw new Error(`Total number of Cards exceeds Deck Size`);
        }
        const cards = new Deck().deal(this.TOTAL_CARDS);
        this[COLOR.RISE] = new Player(COLOR.RISE, cards.slice(0, this.CARD_PER_PLAYER));
        this.swap = cards[this.CARD_PER_PLAYER];
        this[COLOR.FALL] = new Player(COLOR.FALL, cards.slice(this.CARD_PER_PLAYER + 1));

        // Players
        this.current = this[COLOR.RISE];
        this.opposite = this[COLOR.FALL];
        this.togglePlayer();

        // Status
        this.status = STATUS.CURRENT;

    }

    turn() {
        this.emitter(EMIT.TURN, this.current);
        this.info();
    }

    final() {
        this.info();
        this.emitter(EMIT.STATUS, `${this.status}`);
    }

    info() {
        this.emitter(EMIT.SWAP, `${this.swap}`);
        this.emitter(EMIT.PLAYER, this[COLOR.FALL]);
        this.emitter(EMIT.GRID, this.board);
        this.emitter(EMIT.PLAYER, this[COLOR.RISE]);
    }

    pattern(name, flip) {
        name = normalize(name);
        if (!CARDS.get(name)) {
            this.emitter(EMIT.PATTERN, `Invalid Card: ${name}`);
        } else {
            this.emitter(EMIT.GRID, this.patternFactory(name, this.current.color, flip));
        }
    }

    patternFactory(name, color, flip) {
        name = normalize(name);
        const pattern = CARDS.get(name);
        const toFlip = flip === ARGS.FLIP ? -1 : 1;
        const original = color === COLOR.RISE ? 1 : -1;
        const dir = toFlip * original;
        return Board.createPattern(pattern, dir);
    }

    move(rawStart, rawEnd, card) {

        card = normalize(card);
        if (!CARDS.has(card)) {
            return [`Invalid Card: ${card}`, null];
        } else if (!this.current.cards.includes(card)) {
            return [`Card not available: ${card}`, null];
        }

        const convert = raw => {
            const [rawRow, rawCol] = raw
                .toUpperCase()
                .match(/^([a-zA-Z])(\d)$/)
                .slice(1, 3);
            const row = rawRow.charCodeAt(0) - 'A'.charCodeAt(0);
            const col = rawCol - 1;
            return [row, col];
        };

        const [sRow, sCol] = convert(rawStart);
        if (sRow < 0 || sRow >= SIDE_LENGTH ||
            sCol < 0 || sCol >= SIDE_LENGTH)
            return [`Invalid Start Position: ${rawStart}`, null];

        const start = this.board[sRow][sCol];
        if (start.color !== this.current.color)
            return [`Piece not available: ${rawStart}`, null];

        const [eRow, eCol] = convert(rawEnd);
        if (eRow < 0 || eRow >= SIDE_LENGTH ||
            eCol < 0 || eCol >= SIDE_LENGTH)
            return [`Invalid End Position: ${rawEnd}`, null];

        const end = this.board[eRow][eCol];
        if (end.color === this.current.color)
            return [`Invalid Piece in End Position: ${rawEnd}`, null];

        const dir = this.current === this[COLOR.RISE] ? 1 : -1;
        let possible = false;
        for (const [x, y] of CARDS.get(card)) {
            if (sRow - dir * y === eRow && sCol + dir * x === eCol) {
                possible = true;
                break;
            }
        }
        if (!possible) {
            return [`Invalid Move in Card: ${rawStart} to ${rawEnd}`, null];
        }

        this.board[eRow][eCol] = start;
        this.board[sRow][sCol] = new Piece(PIECE.EMPTY);

        const swap = this.swap;
        this.current.cards = [swap, ...this.current.cards.filter(c => c !== card)];
        this.swap = card;

        const color = normalize(start.color);
        const piece = normalize(start.type);
        const move = `from ${sRow}${sCol} to ${eRow}${eCol}`;
        return [null, `${color} ${piece} moved ${move} with ${card}`];
    }

    pass(toPass) {

        toPass = normalize(toPass);
        if (!CARDS.has(toPass)) {
            return [`Invalid Card: ${toPass}`, null];
        } else if (!this.current.cards.includes(toPass)) {
            return [`Card not Available: ${toPass}`, null];
        }

        const dir = this.current === this[COLOR.RISE] ? 1 : -1;
        // For every current player's piece
        for (let row = 0; row < SIDE_LENGTH; row++) {
            for (let col = 0; col < SIDE_LENGTH; col++) {
                const { color } = this.board[row][col];
                if (this.current.color !== color) {
                    continue;
                }
                // For every move on a piece
                for (const card of this.current.cards) {
                    for (const [x, y] of CARDS.get(card)) {
                        const eX = row - dir * y, eY = col + dir * x;
                        if (eX < 0 || eX >= SIDE_LENGTH ||
                            eY < 0 || eY >= SIDE_LENGTH) {
                            continue;
                        }
                        const end = this.board[eX][eY];
                        if (end.color !== this.current.color) {
                            return [`Invalid Pass: Moves Available`, null];
                        }
                    }
                }
            }
        }

        const swap = this.swap;
        this.swap = toPass;
        this.current.cards = [swap, ...this.current.cards.filter(c => c !== toPass)];

        return [null, `Pass with ${toPass}`];
    }

    isNotDone() {

        // Way of the Stone
        const stone = !this.board.some(r =>
            r.some(({ type, color }) =>
                type === PIECE.MASTER && color === this.opposite.color));

        // Way of the Stream
        const templeRow = this.current.color === COLOR.RISE ? 0 : SIDE_LENGTH - 1;
        const templeCol = Math.floor(SIDE_LENGTH / 2);
        const { type, color } = this.board[templeRow][templeCol];
        const stream = type === PIECE.MASTER && color === this.current.color;

        if (stone || stream) {
            this.status = this.current === this[COLOR.RISE]
                ? STATUS.RISEWIN
                : STATUS.FALLWIN;
            return false;
        } else return this.status === STATUS.CURRENT;
    }

    togglePlayer() {
        const current = this.current;
        this.current = this.opposite;
        this.opposite = current;
    }

    surrender() {
        this.status = this.current === this[COLOR.RISE] ?
            STATUS.RISESURRENDER :
            STATUS.FALLSURRENDER;
    }

}
