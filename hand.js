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
        this._possibleactions = getpossibleactions(this._handtotal, this._hand, this._classowner);
        if (this._possibleactions.includes("Busted. Better luck next time!")) {
            this._busted = true
        }
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
    get hit() {
        this._hand.push(this._deckinuse.hit);
        this._handtotal = gethandtotal(this._hand);
        this._possibleactions = getpossibleactions(this._handtotal, this._hand, this._classowner);
        if (this._possibleactions.includes("Busted. Better luck next time!")) {
            this._busted = true;
        }
        return;
    }
    get split(){
        //Get cardobjects, split it in half, hit 2 new cards, save hands
        if (Number(this._classowner._balance) > Number(this.classowner._originalbet) * 2){
            var newhand = new Hand(this._classowner, this._deckinuse);
            newhandarr = [this._hand[1], this._deckinuse.hit];
            newhand.hand = newhandarr;
            getexistingobjects = this.classowner._handobjects;
            getexistingobjects.push(newhand)
            this.classowner._handobjects = getexistingobjects
            newoldcards = [this._hand[0], this.deckinuse.hit];
            this._hand = newoldcards;
            this._handtotal = gethandtotal(this._hand);
            this._possibleactions = getpossibleactions(this._hand);
            this._classowner._currentbet += this._classowner._originalbet
        }
        return;
    }
    get doubledown(){
        if (Number(this._classowner.balance) > Number(this._classowner._originalbet) * 2) {
            this._classowner.currentbet = this._classowner.currentbet + this._classowner._originalbet
            this._hand.push(this._deckinuse.hit);
            this._handtotal = gethandtotal(this._hand);
            this._possibleactions = getpossibleactions(this._handtotal, this._hand, this._classowner);
            if (this._possibleactions.includes("Busted. Better luck next time!")) {
                this._busted = true;
            }
            this._quedaction = "stay"
        }
        return;
    }
    get surrender() {
        this._quedaction = "surrender"
        return;
    }
    get stay() {
        this._quedaction = "stay"
        return;
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
            handtotal = (acecount - i) * 11
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
            if (Number(notaces[i2]) >= 10){
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

function getpossibleactions(handnumbers, rawhand, handowner) {
    //Compute possible actions for given hand
    var possibleactions = [];
    var rawhandarray = [];
    //Strip away suites
    for (var i = 0; i < rawhand.length; i++){
        rawhandarray.push(Number(rawhand[i].slice(1, rawhand[i].length)));
    }

    possibleactions.push("hit");
    possibleactions.push("stay");

    //If split
    if (rawhandarray.length == 2){
        if (Number(rawhandarray[0]) == Number(rawhandarray[1]) && handowner._balance > handowner._originalbet * 2 && (Number(rawhandarray[0]) + Number(rawhandarray[1])) < 20){
            possibleactions.push("split");
        } else if ((Number(rawhandarray[0]) + Number(rawhandarray[1])) >= 20 && handowner._balance > handowner._originalbet * 2) {
            possibleactions.push("split");
        }
    }

    possibleactions.push("surrender");

    if (handowner._balance > handowner._currentbet * 2) {
        possibleactions.push("double down");
    }

    //Blackjack!
    for (var i = 0; i < handnumbers.length; i++) {
        if (handnumbers[i] == 21) {
            possibleactions = ["Blackjack!"];
        }
    }
    isanyhandnotbusted = true
    for (var i = 0; i < handnumbers.length; i++) {
        if (handnumbers[i] <= 21) {
            isanyhandnotbusted = false;
        } 
    }
    if (isanyhandnotbusted) {
        possibleactions = ["Busted. Better luck next time!"] ;
        this._busted = true
    }
    
    return possibleactions
}

module.exports = { Hand };