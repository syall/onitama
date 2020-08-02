const Board = require('./Board.js');
const Game = require('./Game.js');
const { TURN } = require('./Enums.js');

const platform = (lineReader, linePrinter) => {
    const game = new Game(new Board(), linePrinter);
    do {
        console.log(`${'='.repeat(42)}\n`);
        game.togglePlayer();
        game.turn();
        let incomplete = true;
        while (incomplete) {
            const [input, ...rest] = lineReader().split(/\W/g);
            switch (input) {
                case TURN.GAME: {
                    if (rest.length !== 0)
                        console.error(`Invalid number of Arguments`);
                    else
                        game.turn();
                    break;
                }
                case TURN.CARD: {
                    if (rest.length !== 1)
                        console.error(`Invalid number of Arguments`);
                    else
                        console.log(game.pattern(rest.pop()));
                    break;
                }
                case TURN.MOVE: {
                    if (rest.length !== 3)
                        console.error(`Invalid number of Arguments`);
                    else {
                        const [err, message] = game.move(...rest);
                        if (err)
                            console.error(err);
                        else {
                            incomplete = !incomplete;
                            console.log(message);
                        }
                    }
                    break;
                }
                case TURN.PASS: {
                    if (rest.length !== 1)
                        console.error(`Invalid number of Arguments`);
                    else {
                        const [err, message] = game.pass(rest.pop());
                        if (err)
                            console.error(err);
                        else {
                            incomplete = !incomplete;
                            console.log(message);
                        }
                    }
                    break;
                }
                case TURN.QUIT: {
                    if (rest.length !== 0)
                        console.error(`Invalid number of Arguments`);
                    else {
                        game.surrender();
                        incomplete = !incomplete;
                    }
                    break;
                }
                default: {
                    console.log('Help:');
                    console.log('- game');
                    console.log('- card <card>');
                    console.log('- pass <card>');
                    console.log('- move <start> <end> <card>');
                    console.log('- quit');
                    break;
                }
            }
            console.log();
        }
    } while (game.isNotDone());
    console.log(`${'='.repeat(42)}\n`);
    game.final();
    console.log(game.status);
};

module.exports = platform
