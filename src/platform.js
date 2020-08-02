import { Game } from './Game.js';
import { TURN, EMIT } from './Enums.js';

export const platform = (reader, emitter) => {
    const game = new Game(emitter);
    do {
        emitter(EMIT.DIV);
        game.togglePlayer();
        game.turn();
        let incomplete = true;
        while (incomplete) {
            const [input, ...rest] = reader().split(/\W/g);
            switch (input) {
                case TURN.GAME: {
                    if (rest.length !== 0)
                        emitter(EMIT.ERROR, `Invalid number of Arguments`);
                    else game.turn();
                    break;
                }
                case TURN.CARD: {
                    if (rest.length !== 1)
                        emitter(EMIT.ERROR, `Invalid number of Arguments`);
                    else game.pattern(rest.pop());
                    break;
                }
                case TURN.MOVE: {
                    if (rest.length !== 3) {
                        emitter(EMIT.ERROR, `Invalid number of Arguments`);
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
                        emitter(EMIT.ERROR, `Invalid number of Arguments`);
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
                        emitter(EMIT.ERROR, `Invalid number of Arguments`);
                    else {
                        game.surrender();
                        incomplete = !incomplete;
                    }
                    break;
                }
                default: {
                    emitter(EMIT.HELP, 'Help:');
                    emitter(EMIT.HELP, '- game');
                    emitter(EMIT.HELP, '- card <card>');
                    emitter(EMIT.HELP, '- pass <card>');
                    emitter(EMIT.HELP, '- move <start> <end> <card>');
                    emitter(EMIT.HELP, '- quit');
                    break;
                }
            }
            emitter(EMIT.BETWEEN);
        }
    } while (game.isNotDone());
    emitter(EMIT.DIV);
    game.final();
};
