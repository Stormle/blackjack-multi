const participants = require("./participants");
class Hand { 

    constructor(owner, deck) {
        this._hand = [];
        this._deckinuse = deck;
        this._classowner = owner;
        this._busted = false;
        this._quedaction = "waiting";
        this._lowesthandvalue = "";
        this._originalbet = owner._originalbet
        this._currentbet = owner._originalbet
    }

    set hand(hand) {
        this._hand = hand;
        this._handtotal = gethandtotal(this);
        this._possibleactions = getpossibleactions(this);
        if (this._possibleactions.includes("Busted. Better luck next time!")) {
            if (this._classowner._name != "oqjnczmqj3u4rda81h1a") {
                console.log("Player: " + this._classowner._name + " has: " + this._hand + " - " + this._lowesthandvalue + " busted. Better luck next time!")
            }
            this._busted = true
        } else if (this._possibleactions.includes("Blackjack!")) {
            if (this._classowner._name != "oqjnczmqj3u4rda81h1a") {
                console.log("Player: " + this._classowner._name + "- You have:" + this._hand + " - Black jack! ")
            }
            this._quedaction = "win"
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
    set currentbet(currentbet){
        this._currentbet = currentbet;
    }
    get currentbet() {
        return this._currentbet;
    }
    set originalbet(originalbet){
        this._originalbet = originalbet;
    }
    get busted() {
        return this._busted;
    }
    set handvalues(handvalues){
        this._handvalues = handvalues;
    }
    get handvalues() {
        return this._handvalues;
    }
    set lowesthandvalue(lowesthandvalue){
        this._lowesthandvalue = lowesthandvalue;
    }
    get lowesthandvalue() {
        return this._lowesthandvalue;
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
        this._handtotal = gethandtotal(this);
        this._possibleactions = getpossibleactions(this);
        if (this._possibleactions.includes("Busted. Better luck next time!")) {
            if (this._classowner._name != "oqjnczmqj3u4rda81h1a") {
                console.log("Player: " + this._classowner._name + " has: " + this._hand + " - " + this._lowesthandvalue + " busted. Better luck next time!")
            }
            this._busted = true
        } else if (this._possibleactions.includes("Blackjack!")) {
            if (this._classowner._name != "oqjnczmqj3u4rda81h1a") {
            console.log("Player: " + this._classowner._name + "- You have:" + this._hand + " - Black jack! ")
            }
            this._quedaction = "win"
        }
        this._quedaction = "waiting"
        return;
    }
    get split(){
        //Get cardobjects, split it in half, hit 2 new cards, save hands
        if (Number(this._classowner._balance) > Number(this._originalbet) + this._classowner.currentbet){
            var newhandarr = []
            var getexistingobjects = []
            var newoldcards = []
            var newhand = new Hand(this._classowner, this._deckinuse);
            newhandarr = [this._hand[1], this._deckinuse.hit];
            newhand.hand = newhandarr;
            getexistingobjects = this.classowner._handobjects;
            getexistingobjects.push(newhand)
            this.classowner._handobjects = getexistingobjects
            newoldcards = [this._hand[0], this.deckinuse.hit];
            this.hand = newoldcards;
            this._handtotal = gethandtotal(this);
            this._possibleactions = getpossibleactions(this);
            this._classowner._currentbet += Number(this._originalbet)
            this._quedaction = "waiting"
            if (this._possibleactions.includes("Blackjack!")) {
                if (this._classowner._name != "oqjnczmqj3u4rda81h1a") {
                console.log("Player: " + this._classowner._name + "- You have:" + this._hand + " - Black jack! ")
                }
                this._quedaction = "win"
                
            }
        }
        return;
    }
    get doubledown(){
        if (Number(this._classowner._balance) > Number(this._originalbet) * 2) {
            this._currentbet = this._currentbet + this._originalbet
            this._classowner._currentbet += this._originalbet

            this._hand.push(this._deckinuse.hit);
            this._handtotal = gethandtotal(this);
            this._possibleactions = getpossibleactions(this);
            this._quedaction = "stay"
            if (this._possibleactions.includes("Busted. Better luck next time!")) {
                if (this._classowner._name != "oqjnczmqj3u4rda81h1a") {
                    console.log("Player: " + this._classowner._name + " has: " + this._hand + " - " + this._lowesthandvalue + " busted. Better luck next time!")
                }
                this._quedaction = "lose"
                this._busted = true
            } else if (this._possibleactions.includes("Blackjack!")) {
                if (this._classowner._name != "oqjnczmqj3u4rda81h1a") {
                    console.log("Player: " + this._classowner._name + "- You have:" + this._hand + " - Black jack! ")
                }
                this._quedaction = "win"
            }   
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




function gethandtotal(handobject) {
    var handtotal = 0;
    var handnumbers = [];
    var handarray = [];
    var lowesthandvalue = "";
    var acecount = 0;
    var notaces = [];
    var hand = handobject.hand;
    //Strip away suites
    for (var i = 0; i < hand.length; i++){
        handnumbers.push(Number(hand[i].slice(1, hand[i].length)));
    }
    handobject.handvalues = handnumbers;
    for (var i = 0; i < handnumbers.length; i++){
        if (Number(handnumbers[i]) == 1) {
            acecount += 1;
        }else {
            notaces.push(Number(handnumbers[i]));
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
            if (lowesthandvalue == "") {
                lowesthandvalue = handtotal;
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
        if (lowesthandvalue == "") {
            lowesthandvalue = handtotal;
        }
    }
    handobject.lowesthandvalue = Number(handtotal);
    return handarray;
}

function getpossibleactions(handobject) {
    //Compute possible actions for given hand
    var possibleactions = [];
    var rawhandarray = handobject._handvalues

    possibleactions.push("hit");
    possibleactions.push("stay");

    //If split
    if (rawhandarray.length == 2){
        if (Number(rawhandarray[0]) == Number(rawhandarray[1]) && handobject._classowner._balance > handobject._originalbet * 2 && (Number(rawhandarray[0]) + Number(rawhandarray[1])) < 20){
            possibleactions.push("split");
        } else if ((Number(rawhandarray[0]) + Number(rawhandarray[1])) >= 20 && handobject._classowner._balance > handobject._originalbet * 2) {
            possibleactions.push("split");
        }
    }

    possibleactions.push("surrender");

    if (handobject._classowner._balance > handobject._currentbet * 2) {
        possibleactions.push("double down");
    }

    //Blackjack!
    for (var i = 0; i < handobject._handtotal.length; i++) {
        if (handobject._handtotal[i] == 21) {
            possibleactions = ["Blackjack!"];
        }
    }
    isanyhandnotbusted = true
    for (var i = 0; i < handobject._handtotal.length; i++) {
        if (handobject._handtotal[i] <= 21) {
            isanyhandnotbusted = false;
        } 
    }
    if (isanyhandnotbusted) {
        possibleactions = ["Busted. Better luck next time!"] ;
        handobject._busted = true;
    }
    
    return possibleactions;
}

module.exports = { Hand };