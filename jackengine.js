const participants = require("./participants");
const deck1 = require("./deck");
const input = require("./getinput");
const hand = require("./hand");

class Table {
    constructor(){
        this._flop = false
        this._players = [];
        this._playersthisround = [];
        this._thirtyseconds = false
        this._tablestate = "startup"
        console.log("Welcome to the blackjack table! Place your bets, please.");
        this._tablestate = "waiting for players";

    }
    set dealerhand(dealerhand) {
        this._dealerhand = dealerhand;
    }
    get dealerhand() {
        return this._dealerhand;
    }
    set flop(flop) {
        this._flop = flop;
    }
    get flop() {
        return this._flop;
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
            console.log("Join by using the command: rtm.blackjack betamount")
        }

        if (this._tablestate == "round start") {
            startgame(this);
        }

        if (this._tablestate == "do player actions") {
            doplayeraction(this)
            waitforplayeractions(this);
            if (areplayersdone(this)) {
                //All players done. Deal dealer's hand and clear the game.
                endthegame(this);
            }
        }

        if (this._tablestate == "waiting for player actions") {
            waitforplayeractions(this);
        }
        return;
    }
}

function endthegame(tableobject) {
    var allbusted = true;
    for (var i = 0; i < tableobject._playersthisround.length; i++){
        for (var i2 = 0; i2 < tableobject._playersthisround[i].handobjects.length; i2++) {
            if (tableobject._playersthisround[i].handobjects[i2].busted == false) {
                allbusted = false;
            }
        }
    }
    if (allbusted == false) {
        var keepdealing = true
        do {
            keepdealing = shoulddealerhit(tableobject)
            if (keepdealing == true) {
                tableobject._dealerhand.hit;
            }
        } while (keepdealing == true);
        tableobject._flop = true;
        if (tableobject._dealerhand.busted) {
            console.log("Dealer busted: " + tableobject._dealerhand.hand + " - value: " + tableobject.dealerhand._lowesthandvalue)
        } else {
            console.log("Dealer has: " + tableobject._dealerhand.hand + " - value: " + tableobject.dealerhand._handtotal[0])
        }
        
        
        for (var i = 0; i < tableobject._playersthisround.length; i++){
            for (var i2 = 0; i2 < tableobject._playersthisround[i].handobjects.length; i2++) {
                if (tableobject._playersthisround[i].handobjects[i2].busted == true) {
                    tableobject._playersthisround[i].handobjects[i2]._quedaction = "lose" 
                }
                if (tableobject._playersthisround[i].handobjects[i2]._quedaction == "stay" || tableobject._playersthisround[i].handobjects[i2].busted == false) {
                    if (tableobject._playersthisround[i].handobjects[i2]._handtotal[0] > tableobject._dealerhand._handtotal[0]) {
                        tableobject._playersthisround[i].handobjects[i2]._quedaction = "win"
                        console.log("Player: " + tableobject._playersthisround[i].name + " won with the hand: " + tableobject._playersthisround[i].handobjects[i2].hand + " - value: " + tableobject._playersthisround[i].handobjects[i2].handtotal[0])
                    } else if (tableobject._playersthisround[i].handobjects[i2].busted == false && tableobject._dealerhand.busted == true) {
                        tableobject._playersthisround[i].handobjects[i2]._quedaction = "win"
                        console.log("Player: " + tableobject._playersthisround[i].name + " won with the hand: " + tableobject._playersthisround[i].handobjects[i2].hand + " - value: " + tableobject._playersthisround[i].handobjects[i2].handtotal[0])
                    } else if (tableobject._dealerhand.busted == false) {
                        tableobject._playersthisround[i].handobjects[i2]._quedaction = "lose"
                        if (tableobject._playersthisround[i].handobjects[i2].busted == true) {
                            console.log("Player: " + tableobject._playersthisround[i].name + " lost with the cards: " + tableobject._playersthisround[i].handobjects[i2].hand + " - value: " + tableobject._playersthisround[i].handobjects[i2]._lowesthandvalue + " Better luck next time!")
                        } else {
                            console.log("Player: " + tableobject._playersthisround[i].name + " lost with the cards: " + tableobject._playersthisround[i].handobjects[i2].hand + " - value: " + tableobject._playersthisround[i].handobjects[i2].handtotal[0] + " Better luck next time!")
                        }
                    }   
                }
            }
        }
        payplayers(tableobject)
    }
    //Clear all objects for a new game
    
    for (var i = 0; i < tableobject._playersthisround.length; i++){
        tableobject._playersthisround[i]._deck = null;
        tableobject._playersthisround[i]._handobjects = [];
        tableobject._playersthisround[i]._currentbet = 0;
        tableobject._playersthisround[i]._originalbet = 0;
    }
    tableobject.deck = null;
    tableobject._playersthisround = [];
    tableobject.thirtyseconds = false;
    tableobject.flop = false
    tableobject.dealerhand = [];
    console.log("Welcome to the blackjack table! Place your bets, please.");
    tableobject._tablestate = "waiting for players";
}

function shoulddealerhit(tableobject) {
    if (tableobject._dealerhand._handvalues[1] == 1 && tableobject._dealerhand._handvalues[0] == 6 && tableobject._dealerhand._handvalues.length == 2) {
        //Soft 17, hit
        return true;
    }
    if (tableobject._dealerhand._handvalues[1] == 6 && tableobject._dealerhand._handvalues[0] == 1 && tableobject._dealerhand._handvalues.length == 2) {
        //Soft 17, hit
        return true;
    }
    if (tableobject._dealerhand._lowesthandvalue >= 17 && tableobject._dealerhand._handtotal.length < 2) {
        return false;
    } else if (tableobject._dealerhand._handtotal.length >= 2 && tableobject._dealerhand._handtotal[0] >= 17) {
        return false;
    } else {
        return true;
    }
}

function areplayersdone(tableobject) {
    for (var i = 0; i < tableobject._playersthisround.length; i++){
        for (var i2 = 0; i2 < tableobject._playersthisround[i].handobjects.length; i2++) {
        if (tableobject._playersthisround[i]._handobjects[i2]._quedaction == "hit" || tableobject._playersthisround[i]._handobjects[i2]._quedaction == "split" || tableobject._playersthisround[i]._handobjects[i2]._quedaction == "waiting" || tableobject._playersthisround[i]._handobjects[i2]._quedaction == "double down") {
            if (tableobject._playersthisround[i].handobjects[i2]._busted == false) {
                return false;
            }
            
        }
        }
    }
    return true;
}

function doplayeraction(tableobject) {
    tableobject._tablestate = "waiting for player actions";
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
            if (action == "stay") {
                chosenhand.stay;
            }
    }
    }
    if (areplayersdone(tableobject)){
        endthegame(tableobject)
    }
}

function waitforplayeractions(tableobject) {
//Print out what the starting situation is.
        
    console.log("The dealer's hand: " + tableobject._dealerhand.hand[0]);
        
        for (var i = 0; i < tableobject._playersthisround.length; i++){
            var handstring = "";
            var firstemptyhand;
            var firstemptyfound = false;
            for (var i2 = 0; i2 < tableobject._playersthisround[i].handobjects.length; i2++) {
                handstring += String(tableobject._playersthisround[i].handobjects[i2].hand)
                if (tableobject._playersthisround[i].handobjects.length > 1 && i2 != tableobject._playersthisround[i].handobjects[i2].length) {
                handstring += " - ";
                }
                if (firstemptyfound == false && tableobject._playersthisround[i].handobjects[i2].quedaction == "waiting" && tableobject._playersthisround[i].handobjects[i2].busted == false) {
                    firstemptyhand = tableobject._playersthisround[i].handobjects[i2];
                    firstemptyfound = true;
                }
                
            }
            
            var totaltext = ""
            if (firstemptyfound == true){
                if (tableobject._playersthisround[i]._handobjects.length < 1) {
                    totaltext = "Player: " + tableobject._playersthisround[i].name + " - you have: " + handstring + " - value: " + firstemptyhand.handtotal + " What would you like to do to the hand: " + firstemptyhand.hand + "? Your options are: " + firstemptyhand.possibleactions;
                } else {
                    totaltext = "Player: " + tableobject._playersthisround[i].name + " - you have: " + handstring + " - value: " + firstemptyhand.handtotal + " What would you like to do? Your options are: " + firstemptyhand.possibleactions;
                }
                console.log(totaltext);
            }
        }
        
            var playersnotready = false;
            for (var i = 0; i < tableobject._playersthisround.length; i++){
                for (var i2 = 0; i2 < tableobject._playersthisround[i].handobjects.length; i2++) { 
                    if (tableobject._playersthisround[i].handobjects[i2].quedaction == "waiting" && tableobject._playersthisround[i].handobjects[i2].busted == false && tableobject._playersthisround[i].handobjects[i2].possibleactions != "Blackjack!") {
                        playersnotready = true;
                    }
                }
            }
            if (playersnotready == false){
                tableobject._tablestate = "do player actions";
                doplayeraction(tableobject)
            }
        
}

function startgame(tableobject) {
    //Generate deck
    var endthegamebool = false
    tableobject._deck = new deck1.Deck;    
    //Empty dealer's hand
    //oqjnczmqj3u4rda81h1a is the secret dealer name that mutes outputs for hand functions
        var dealer = new participants.Player("oqjnczmqj3u4rda81h1a", "0", "0", "0");
        
        tableobject._dealerhand = new hand.Hand(dealer, tableobject._deck);

        

        //Deal dealer's cards
        tableobject._dealerhand.hit;
        tableobject._dealerhand.hit;

        //Create and empty new hands for players
        for (var i = 0; i < tableobject._playersthisround.length; i++) {
            tableobject._playersthisround[i]._handobjects = [];
            tableobject._playersthisround[i]._handobjects.push(new hand.Hand(tableobject._playersthisround[i], tableobject._deck));
        }
        //Deal new starting cards
        for (var twice = 0; twice < 2; twice++){
            for (var i = 0; i < tableobject._playersthisround.length; i++){
                try {
                    for (var i2 = 0; i2 < tableobject._playersthisround[i]._handobjects.length; i2++){
                        tableobject._playersthisround[i].handobjects[i2].hit;
                        if (tableobject._playersthisround[i].handobjects[i2].handtotal.includes(21) && !tableobject._dealerhand.handtotal.includes(21)) {
                            tableobject._playersthisround[i].handobjects[i2].quedaction = "win";
                            console.log("Congratulations! " + tableobject._playersthisround[i].name + " got a blackjack!")
                            payplayers(tableobject);
                            i2 -= 1;
                        }
                        
                    }
                }catch {
                    //player has no hands
                }
            }
        }
        if (tableobject._dealerhand.handtotal.includes(21)){
            console.log("Dealer got blackjack. " + tableobject._dealerhand.hand + " - value: 21")
            for (var i = 0; i < tableobject._playersthisround.length; i++){
                for (var i2 = 0; i2 < tableobject._playersthisround[i]._handobjects.length; i2++){
                if (tableobject._playersthisround[i]._handobjects[i2]._handtotal.includes(21)) {
                    //Draw
                    tableobject._playersthisround[i]._handobjects[i2].quedaction = "draw"
                    console.log(tableobject._playersthisround[i].name + "and the dealer both got a black jack! It's a draw and your money is returned." + tableobject._playersthisround[i]._handobjects[i2].hand + " - value: 21")
                    returnplayermoney(tableobject._playersthisround[i])
                } else {
                    tableobject._playersthisround[i]._handobjects[i2].busted = true
                    console.log(tableobject._playersthisround[i].name + " lost with the cards: " + tableobject._playersthisround[i]._handobjects[i2].hand + " - value: " + tableobject._playersthisround[i]._handobjects[i2].handtotal[0])
                }
                tableobject.tablestate = ""
                }
            }
            endthegamebool = true
            endthegame(tableobject)
        }
        //BAD THING IF THIS RUNS AFTER A DEALER BLACKJACK
        if (endthegamebool == false) {
            tableobject._tablestate = "waiting for player actions";
        }
        
}

function returnplayermoney(playerobject) {
    //This function should only trigger when both player and dealer get black jack with the first 2 cards
    //Return this amount of money back to the player
    var amounttoreturn = playerobject._originalbet;
}

function sendcoins(player, currentbet) {
    payout = currentbet * 2
    console.log("Debug: sending " + player.name + " " + payout + " coins. This is not actually happening. Make the code for sending coins.")
}

function payplayers(tableobject) {
    //This function might be triggered early due to a blackjack in the first 2 cards.
    //so remember to change hand's quedaction to avoid double payments.
    try {
    var deleted = false
        for (var i = 0; i < tableobject._playersthisround.length; i++){
            for (var i2 = 0; i2 < tableobject._playersthisround[i]._handobjects.length; i2++){
                var payamount = tableobject._playersthisround[i]._handobjects[i2]._currentbet
                if (deleted == true) {
                    i2 = 0;
                    i = 0;
                    deleted = false;
                }
                if (tableobject._playersthisround[i]._handobjects[i2].quedaction == "win" && tableobject._playersthisround[i]._handobjects[i2].hand.length == 2 && !tableobject._dealerhand._handtotal.includes(21) && tableobject.flop == false) {
                    //Instant blackjack win that gets paid prematurely
                    sendcoins(tableobject._playersthisround[i], payamount)
                    tableobject._playersthisround[i]._handobjects = deletefromarray(tableobject._playersthisround[i]._handobjects, i2)
                    deleted = true;
                    if (tableobject._playersthisround[i].handobjects.length == 0) {
                        //Out of hands, deleting player
                        tableobject._playersthisround = deletefromarray(tableobject._playersthisround, i)
                    }
                } else if (tableobject._playersthisround[i]._handobjects[i2].quedaction == "win" && deleted == false && tableobject.flop == true) {
                    //Normal win going through the full process
                    sendcoins(tableobject._playersthisround[i], payamount)
                    tableobject._playersthisround[i]._handobjects = deletefromarray(tableobject._playersthisround[i]._handobjects, i2)
                    deleted = true;
                    if (tableobject._playersthisround[i].handobjects.length == 0) {
                        //Out of hands, deleting player
                        tableobject._playersthisround = deletefromarray(tableobject._playersthisround, i)
                    }
                } else if (tableobject._playersthisround[i]._handobjects[i2].quedaction == "surrender" && deleted == false) {
                    //Surrender payout
                    var halfamount = payamount / 2
                    sendcoins(tableobject._playersthisround[i], payamount)
                    tableobject._playersthisround[i]._handobjects = deletefromarray(tableobject._playersthisround[i]._handobjects, i2)
                    deleted = true;
                    if (tableobject._playersthisround[i].handobjects.length == 0) {
                        //Out of hands, deleting player
                        tableobject._playersthisround = deletefromarray(tableobject._playersthisround, i)
                    }

                }
            }
        }
    }catch (error) {
        console.error("Payment loop catch error: " + error);
    }
}
function deletefromarray(array, index) {
    var newarray = []
    for (var i = 0; i < array.length; i++){
        if (i != index) {
            newarray.push(array[i]);
        }
    }
    return newarray
}

module.exports = { Table };