class Player {

    constructor(color, cards) {
        this.color = color;
        this.cards = cards;
    }

    toString() {
        return `${this.color} Player's Cards: ${this.cards.join(', ')}`;
    }

}

module.exports = Player;
