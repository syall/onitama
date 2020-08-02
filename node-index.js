const rl = require('readline-sync');
const platform = require('./src/platform.js');
const { PIECE, EMIT } = require('./src/Enums.js');

platform(reader, emitter);

function reader() {
    return rl.question('> ');
}

function emitter(emit, ...args) {

    function normalize(s) {
        const first = s.slice(0, 1).toUpperCase();
        const rest = s.slice(1).toLowerCase();
        return `${first}${rest}`;
    }

    switch (emit) {
        case EMIT.GRID: {
            const grid = args.shift();
            const top = `┏━━${`┳━━`.repeat(grid.length - 1)}┓\n`;
            const inner = grid.map(o =>
                `┃${o.map(({ type, color }) => {
                    if (type === PIECE.EMPTY)
                        return '  ';
                    else if (type === PIECE.TARGET)
                        return '<>';
                    else if (type === PIECE.CENTER)
                        return '()';
                    else
                        return `${color[0]}${type[0]}`;
                }).join('┃')}┃`)
                .join(`\n┣━━${`╋━━`.repeat(grid.length - 1)}┫\n`);
            const bottom = `\n┗━━${`┻━━`.repeat(grid.length - 1)}┛`;
            console.log(`${top}${inner}${bottom}`);
            break;
        }
        case EMIT.ERROR: {
            console.error(args.shift());
            break;
        }
        case EMIT.SUCCESS: {
            console.log(args.shift());
            break;
        }
        case EMIT.BETWEEN: {
            console.log();
            break;
        }
        case EMIT.DIV: {
            console.log(`${'='.repeat(42)}\n`);
            break;
        }
        case EMIT.HELP: {
            console.log(args.shift());
            break;
        }
        case EMIT.TURN: {
            const { color } = args.shift();
            console.log(`${normalize(color)} Player's Turn`);
            break;
        }
        case EMIT.STATUS: {
            console.log(`\n<<< ${args.shift()} >>>`);
            break;
        }
        case EMIT.SWAP: {
            console.log(`Swap Card: ${args.shift()}`);
            break;
        }
        case EMIT.PLAYER: {
            const { color, cards } = args.shift();
            console.log(`${normalize(color)} Player's Cards: ${cards.join(', ')}`);
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
}
