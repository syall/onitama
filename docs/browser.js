import { platform } from '../src/platform.js';
import { PIECE, EMIT, COLOR } from '../src/enums.js';
import { normalize } from '../src/utils.js';

platform(reader, emitter);

function reader() {
    const string = prompt('Put input');
    console.log(`Input: ${string}`);
    return string;
}

function emitter(emit, ...args) {

    switch (emit) {
        case EMIT.GRID: {
            gridPrinter(args.shift());
            break;
        }
        case EMIT.ERROR: {
            document.getElementById('status').innerHTML = `${args.shift()}`;
            break;
        }
        case EMIT.SUCCESS: {
            document.getElementById('status').innerHTML = `${args.shift()}`;
            break;
        }
        case EMIT.BETWEEN: {
            break;
        }
        case EMIT.DIV: {
            break;
        }
        case EMIT.HELP: {
            break;
        }
        case EMIT.TURN: {
            const { color } = args.shift();
            document.getElementById('turn').innerHTML = `${normalize(color)}`;
            break;
        }
        case EMIT.STATUS: {
            document.getElementById('status').innerHTML = `\n<<< ${args.shift()} >>>`;
            break;
        }
        case EMIT.SWAP: {
            document.getElementById('swap').innerHTML = args.shift();
            break;
        }
        case EMIT.PLAYER: {
            const { color, cards } = args.shift();
            if (color === COLOR.RISE)
                document.querySelector('.player.rise').innerHTML = cards.join(', ');
            else
                document.querySelector('.player.fall').innerHTML = cards.join(', ');
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

    function gridPrinter(grid) {
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
        const output = grid[2][2].type === PIECE.CENTER ? EMIT.PATTERN : EMIT.GRID;
        document.getElementById(output.toLowerCase()).innerHTML = turn.innerHTML;
    }

}
