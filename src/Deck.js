import { CARDS } from './enums.js';

export class Deck {

    deal(number) {

        // Fisher–Yates shuffle
        const shuffled = [...CARDS.keys()];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            const temp = shuffled[i];
            shuffled[i] = shuffled[j];
            shuffled[j] = temp;
        }

        return shuffled.slice(0, number);
    }

}
