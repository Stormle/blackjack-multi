const participants = require("./participants");
class Hand { 

    constructor(owner, deck) {
        this._hand = [];
        this._deckinuse = deck;
        this._classowner = owner;
        this._busted = false;
    }

    set hand(hand) {
        this._hand = hand;
        this._handtotal = gethandtotal(this._hand);
        this._possibleactions = getpossibleactions(this._hand);

    }
    get hand() {
        return this._hand;
    }
    set busted(busted){
        this._busted = busted;
    }
    get busted() {
        return this._busted;
    }
    set classowner(owner){
        this._classowner = owner;
    }
    get classowner() {
        return this._classowner;
    }
    set deckinuse(deck) {
        this._deckinuse = deck;
    }
    get deckinuse() {
        return this._deckinuse;
    }
    get handtotal() {
        return this._handtotal;
    }
    set handtotal(handtotal) {
        this._handtotal = handtotal;
    }
    get possibleactions() {
        return this._possibleactions;
    }
    set quedaction(quedaction) {
        this._quedaction = quedaction;
    }
    get quedaction() {
        return this._quedaction;
    }
    set hit(card) {
        this._hand.push(card);
        this._handtotal = gethandtotal(this._hand);
        this._possibleactions = getpossibleactions(this._handtotal);
    }
    get split(){
        //Split needs the player object that needs splitting along with 2 fresh cards
        if (Number(this._classowner._balance) > Number(this.classowner._originalbet) * 2){
            var newhand = new Hand(this._classowner, this._deckinuse);
            newhandarr = [this._hand[1], this.deckinuse.hit];
            newhand.hand = newhandarr;
            getexistingobjects = playerobject.handobjects();
            getexistingobjects.push(newhand)
            newoldcards = [this._hand[0], this.deckinuse.hit];
            this._hand = newoldcards;
            this._handtotal = gethandtotal(this._hand);
            this._possibleactions = getpossibleactions(this._hand);
            this._classowner._currentbet += this._classowner._originalbet
        }
        
    }
}

function gethandtotal(hand) {
    var handtotal = 0;
    var handnumbers = [];
    var handarray = [];
    var acecount = 0
    var notaces = []
    //Strip away suites
    for (var i = 0; i < hand.length; i++){
        handnumbers.push(Number(hand[i].slice(1, hand[i].length)));
    }

    for (var i = 0; i < handnumbers.length; i++){
        if (Number(handnumbers[i]) == 1) {
            acecount += 1
        }else {
            notaces.push(Number(handnumbers[i]))
        }
    }
    if (acecount != 0) {
        //Aces included
        for (var i = 0; i <= acecount; i++){
            //Add this iteration number of 11's
            handtotal = acecount - i * 11
            //Add the remaining aces as 1's
            handtotal += i
            //Adding rest of the non-aces
            for (var i2 = 0; i2 < notaces.length; i2++) {
                if (notaces[i2] >= 10){
                    handtotal += 10;
                } else {
                    handtotal += Number(notaces[i2]);
                }
            }
            if (handtotal <= 21) {
                handarray.push(handtotal);
            }
        }
    } else {
        //Aces not included
        handtotal = 0
        for (var i2 = 0; i2 < notaces.length; i2++) {
            if (notaces[i2] >= 10){
                handtotal += 10;
            } else {
                handtotal += Number(notaces[i2]);
            }
        }
        if (handtotal <= 21) {
            handarray.push(handtotal);
        }
    }
    
    
    return handarray;
}

function getpossibleactions(handnumbers) {
    //Compute possible actions for given hand
    var possibleactions = [];
    var handarray = [];


    possibleactions.push("hit");
    possibleactions.push("stay");

    //If split
    if (handnumbers.length == 2){
        if (handnumbers[0] == handnumbers[1] && this._balance > this._originalbet * 2){
            possibleactions.push("split");
        }
    }

    //
    
    possibleactions.push("surrender");

    if (this._balance > this._currentbet * 2) {
        possibleactions.push("double down");
    }

    //Blackjack!
    for (var i = 0; i < handarray.length; i++) {
        if (handarray[i] == 21) {
            possibleactions = ["Blackjack! No further action needed."];
        }
    }
    isanyhandnotbusted = true
    for (var i = 0; i < handarray.length; i++) {
        if (handarray[i] <= 21) {
            isanyhandnotbusted = false;
        } 
    }
    if (isanyhandnotbusted) {
        possibleactions = ["You busted. Better luck next time!"] ;
        this._busted = true
    }
    
    return possibleactions
}

module.exports = { Hand };