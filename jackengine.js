const participants = require("./participants");
const deck1 = require("./deck");
const input = require("./getinput");
const hand = require("./hand");

class Table {
    constructor(){

        this._players = [];
        this._playersthisround = [];
        this._thirtyseconds = false
        this._tablestate = "startup"
        this._playersthisround = [];

    }
    set dealerhand(dealerhand) {
        this._dealerhand = dealerhand;
    }
    get dealerhand() {
        return this._dealerhand;
    }
    set addplayer(players) {
        this._players.push(players);
    }
    get addplayer() {
        return this._players;
    }
    set deck(deck) {
        this._deck = deck;
    }
    get deck() {
        return this._deck;
    }
    set addplayerthisround(playersthisround) {
        this._playersthisround.push(playersthisround);
    }
    get addplayerthisround() {
        return this._playersthisround;
    }
    set thirtyseconds(thirtyseconds) {
        this._thirtyseconds = thirtyseconds;
    }
    get thirtyseconds() {
        return this._thirtyseconds;
    }
    set tablestate(tablestate) {
        this._tablestate = tablestate;
    }
    get tablestate() {
        return this._tablestate;
    }
    get tick(){
        //Game logic code here
        if (this._tablestate == "startup") {
            console.log("Welcome to the blackjack table! Place your bets, please.");
            this._tablestate = "waiting for players";
        }

        if (this._tablestate == "waiting for players") {

        }

        if (this._tablestate == "round start") {
            startgame(this);
        }

        if (this._tablestate == "waiting for player actions") {
            waitforplayeractions(this);
        }

        if (this._tablestate == "do player actions") {
            doplayeraction(this)
        }

        if (this._tablestate == "actionsdone") {
            
        }
        return;
    }
}


function doplayeraction(tableobject) {
    for (var i = 0; i < tableobject._playersthisround.length; i++){
        for (var i2 = 0; i2 < tableobject._playersthisround[i].handobjects.length; i2++) {
            var chosenhand = tableobject._playersthisround[i].handobjects[i2];
            var action = chosenhand.quedaction;

            if (action == "hit") {
                chosenhand.hit;
            }
            if (action == "split") {
                chosenhand.split;
            }
            if (action == "double down") {
                chosenhand.doubledown;
            }
            if (action == "surrender") {
                chosenhand.surrender;
            }
            if (action == "") {
                chosenhand.stay;
            }
            if (action == "stay") {
                chosenhand.stay;
            }
    }
}
}

function waitforplayeractions(tableobject) {
//Print out what the starting situation is.
        console.log("The dealer's cards are: " + tableobject._dealerhand);
        
        for (var i = 0; i < tableobject._playersthisround.length; i++){
            var handstring = ""
            var firstemptyhand
            var firstemptyfound = false
            for (var i2 = 0; i2 < tableobject._playersthisround[i].handobjects.length; i2++) {
                handstring += String(tableobject._playersthisround[i].handobjects[i2].hand)
                if (tableobject._playersthisround[i].handobjects.length > 1 && i2 != tableobject._playersthisround[i].handobjects[i2].length) {
                handstring += " - ";
                }
                if (firstemptyfound == false && tableobject._playersthisround[i].handobjects[i2].quedaction == "") {
                    firstemptyhand = tableobject._playersthisround[i].handobjects[i2];
                    firstemptyfound = true;
                }
                
            }
            
            var totaltext = ""
            if (firstemptyfound == true){
                if (tableobject._playersthisround[i]._handobjects.length < 1) {
                    totaltext = "Player: " + tableobject._playersthisround[i].name + " - you have: " + handstring + " What would you like to do to the hand: " + firstemptyhand.hand + "? Your options are: " + firstemptyhand.possibleactions;
                } else {
                    totaltext = "Player: " + tableobject._playersthisround[i].name + " - you have: " + handstring + " What would you like to do? Your options are: " + firstemptyhand.possibleactions;
                }
                console.log(totaltext)
            }
        }
        
            var playersnotready = false;
            for (var i = 0; i < tableobject._playersthisround.length; i++){
                for (var i2 = 0; i2 < tableobject._playersthisround[i].handobjects.length; i2++) { 
                    if (tableobject._playersthisround[i].handobjects[i2].quedaction == "") {
                        playersnotready = true;
                    }
                }
            }
            if (playersnotready == false){
                this._tablestate = "do player actions";
            }
        
}

function startgame(tableobject) {
        //Empty dealer's hand
        tableobject._dealerhand = [];

        //Generate deck
        tableobject._deck = new deck1.Deck;

        //Deal dealer's card
        tableobject._dealerhand.push(tableobject._deck.hit);
        
        //Create and empty new hands for players
        for (var i = 0; i < tableobject._playersthisround.length; i++) {
            tableobject._playersthisround[i]._handobjects = [];
            tableobject._playersthisround[i]._handobjects.push(new hand.Hand(tableobject._playersthisround[i], tableobject._deck));
        }
        //Deal new starting cards
        for (var twice = 0; twice < 2; twice++){
            for (var i = 0; i < tableobject._playersthisround.length; i++){
                for (var i2 = 0; i2 < tableobject._playersthisround[i]._handobjects.length; i2++){
                    tableobject._playersthisround[i].handobjects[i2].hit;
                }
            }
        }
        tableobject._tablestate = "waiting for player actions";
}



module.exports = { Table };