class Deck { 
    constructor() { 
        this._cards = newdeck();
    }
    set cards(cards) {
        this._cards = cards;
    }
    get cards() {
        return this._cards;
    }
    get shuffle(){
        this._cards = newdeck();
        return
    }
    get hit() {
        if (this._cards.length == 0) {
            this._cards = newdeck();
        }
        var topmostcard = this._cards[0];
        this._cards.shift();
        return topmostcard;
    }
}

function newdeck() {
    var suites = ["s", "h", "d", "c"];
        var numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
        var deck = [];
        for (var i = 0; i < suites.length; i++) {
            for (var i2 = 0; i2 < numbers.length; i2++) {
                deck.push(suites[i] + numbers[i2]);
            }
        }
        deck = shufflefunct(deck);
        return deck;
}

function shufflefunct(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

module.exports = { Deck };