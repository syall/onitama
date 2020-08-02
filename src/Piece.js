class Piece {

    constructor(type, color) {
        this.type = type;
        this.color = color;
    }

    toString() {
        return `${this.color[0]}${this.type[0]}`;
    }

}

module.exports = Piece;
