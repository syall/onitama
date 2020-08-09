import { Game } from '../src/Game.js';
import { normalize } from '../src/utils.js';
import { PIECE, COLOR, TURN, EMIT } from '../src/enums.js';

const game = new Game(emitter);
let incomplete = true;
const inputArea = document.getElementById('input');

(function main() {
    init();
    inputArea.addEventListener('keypress', turn);
})();

function init() {
    game.togglePlayer();
    game.turn();
}

function turn(event) {

    if (event.keyCode !== 13) {
        return;
    }

    const [input, ...rest] = event.target.value.trim().split(/\W/g);

    const history = document.querySelector('.history');
    const message = document.createElement('div');
    message.innerHTML = `${input} ${rest.join(' ')}`;
    history.prepend(message);

    switch (input) {
        case TURN.MOVE: {
            if (rest.length !== 3) {
                emitter(EMIT.ERROR, `Invalid # of Arguments: ${rest.length}`);
                break;
            }
            const [err, message] = game.move(...rest);
            if (err)
                emitter(EMIT.ERROR, err);
            else {
                incomplete = !incomplete;
                emitter(EMIT.SUCCESS, message);
            }
            break;
        }
        case TURN.PASS: {
            if (rest.length !== 1) {
                emitter(EMIT.ERROR, `Invalid # of Arguments: ${rest.length}`);
                break;
            }
            const [err, message] = game.pass(rest.pop());
            if (err)
                emitter(EMIT.ERROR, err);
            else {
                incomplete = !incomplete;
                emitter(EMIT.SUCCESS, message);
            }
            break;
        }
        case TURN.QUIT: {
            if (rest.length !== 0)
                emitter(EMIT.ERROR, `Invalid # of Arguments: ${rest.length}`);
            else {
                game.surrender();
                incomplete = !incomplete;
            }
            break;
        }
        default: {
            emitter(EMIT.ERROR, `Unknown command`);
            break;
        }
    }

    if (!incomplete) {
        if (game.isNotDone()) {
            init();
            incomplete = true;
        } else {
            game.final();
            inputArea.removeEventListener('keypress', turn);
        }
    }

    inputArea.value = '';
}

function emitter(emit, ...args) {

    switch (emit) {
        case EMIT.GRID: {
            gridPrinter(args.shift());
            break;
        }
        case EMIT.SUCCESS: {
            const history = document.querySelector('.history');
            const message = document.createElement('div');
            message.classList.add('success');
            message.innerHTML = args.shift();
            history.prepend(message);
            break;
        }
        case EMIT.ERROR: {
            const history = document.querySelector('.history');
            const message = document.createElement('div');
            message.classList.add('error');
            message.innerHTML = args.shift();
            history.prepend(message);
            break;
        }
        case EMIT.TURN: {
            const { color } = args.shift();
            const history = document.querySelector('.history');
            const message = document.createElement('div');
            message.classList.add('turn');
            message.innerHTML = `${normalize(color)} Player's Turn`;
            history.prepend(message);
            break;
        }
        case EMIT.STATUS: {
            const status = args.shift();
            const history = document.querySelector('.history');
            const message = document.createElement('div');
            message.classList.add('status');
            message.innerHTML = status;
            history.prepend(message);
            break;
        }
        case EMIT.SWAP: {
            const name = args.shift();
            const swap = `.swap `;
            document.querySelector(`${swap}.name`).innerHTML = name;
            gridPrinter(game.patternFactory(name, COLOR.RISE), swap);
            break;
        }
        case EMIT.PLAYER: {
            const { color, cards: [firstCard, secondCard] } = args.shift();
            const HEAD = color === COLOR.RISE ? '.rise' : '.fall';
            const first = `${HEAD} .first`;
            document.querySelector(`${first}.name`).innerHTML = firstCard;
            gridPrinter(game.patternFactory(firstCard, color), first);
            const second = `${HEAD} .second`;
            document.querySelector(`${second}.name`).innerHTML = secondCard;
            gridPrinter(game.patternFactory(secondCard, color), second);
            break;
        }
        case EMIT.PATTERN: {
            gridPrinter(args.shift());
            break;
        }
        default: {
            throw new Error(`Unknown emit: ${emit}`);
        }
    }

    function gridPrinter(grid, target) {
        const turn = document.createElement('div');
        turn.classList.add('turn');
        for (const o of grid) {
            const row = document.createElement('div');
            row.classList.add('row');
            for (const { type, color } of o) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.classList.add('piece');
                if (type === PIECE.EMPTY)
                    cell.innerHTML = '‎‎‏‏‎&#8195;';
                else if (type === PIECE.TARGET) {
                    cell.innerHTML = '&#9812;';
                } else if (type === PIECE.CENTER) {
                    cell.innerHTML = '&#9818;';
                } else {
                    cell.classList.add(color === COLOR.RISE ? 'red' : 'blue');
                    cell.innerHTML = type === PIECE.MASTER ? '&#9818;' : '&#9823;';
                }
                row.appendChild(cell);
            }
            turn.appendChild(row);
        }
        if (!target) {
            document.querySelector('.grid .display').innerHTML = turn.innerHTML;
        } else {
            const pattern = `${target}.card`;
            document.querySelector(pattern).innerHTML = turn.innerHTML;
        }
    }

}
