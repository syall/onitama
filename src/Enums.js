const PIECE = {
    MASTER: 'MASTER',
    STUDENT: 'STUDENT',
    EMPTY: 'EMPTY',
    TARGET: 'TARGET',
    CENTER: 'CENTER'
};

const COLOR = {
    RISE: 'RISING',
    FALL: 'FALLING',
};

const STATUS = {
    CURRENT: 'Game in Progress...',
    RISEWIN: 'The Rising Player Wins!',
    FALLWIN: 'The Falling Player Wins!',
    RISESURRENDER: 'The Rising Player Surrenders!',
    FALLSURRENDER: 'The Falling Player Surrenders!'
};

const CARDS = new Map([
    // ['Name', [...[x offset, y offset]]]
    ['Tiger', [[0, 2], [0, -1]]],
    ['Dragon', [[-2, 1], [2, 1], [-1, -1], [1, -1]]],
    ['Frog', [[-2, 0], [-1, 1], [1, -1]]],
    ['Rabbit', [[-1, -1], [1, 1], [2, 0]]],
    ['Crab', [[-2, 0], [0, 1], [2, 0]]],
    ['Elephant', [[-1, 1], [1, 1], [-1, 0], [1, 0]]],
    ['Goose', [[-1, 1], [-1, 0], [1, 0], [1, -1]]],
    ['Rooster', [[-1, -1], [-1, 0], [1, 0], [1, 1]]],
    ['Monkey', [[-1, 1], [1, 1], [-1, -1], [1, -1]]],
    ['Mantis', [[-1, 1], [1, 1], [0, -1]]],
    ['Horse', [[-1, 0], [0, 1], [0, -1]]],
    ['Ox', [[1, 0], [0, 1], [0, -1]]],
    ['Crane', [[0, 1], [-1, -1], [1, -1]]],
    ['Boar', [[-1, 0], [1, 0], [0, 1]]],
    ['Eel', [[-1, 1], [-1, -1], [1, 0]]],
    ['Cobra', [[-1, 0], [1, 1], [1, -1]]]
]);

const TURN = {
    GAME: 'game',
    CARD: 'card',
    MOVE: 'move',
    PASS: 'pass',
    QUIT: 'quit'
};

const SIDE_LENGTH = 5;

const CARDS_PER_PLAYER = 2;

const EMIT = {
    GRID: 'Grid',
    ERROR: 'Error',
    SUCCESS: 'Success',
    BETWEEN: 'Between',
    DIV: 'Div',
    HELP: 'Help',
    TURN: 'Turn',
    STATUS: 'Status',
    SWAP: 'Swap',
    PLAYER: 'Player',
    PATTERN: 'Pattern'
};

module.exports = {
    PIECE,
    COLOR,
    STATUS,
    CARDS,
    TURN,
    SIDE_LENGTH,
    CARDS_PER_PLAYER,
    EMIT
};
