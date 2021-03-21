const participants = require("./participants");
const deck1 = require("./deck");
const input = require("./getinput");
const hand = require("./hand");

class Table {
    constructor(players){
        var deck = new deck1.Deck;
        console.log("Welcome to the blackjack table! Place your bets, please.");
        
        //Let players bet here and append them to the playersthisround array


        var playersthisround = [];
        
        //DEBUG SHIT!!! THIS IS HERE TO REPLACE USER INPUT
        playersthisround.push(players[0]);
        playersthisround[0].originalbet = 10

        playersthisround.push(players[1]);
        playersthisround[1].originalbet = 33
        //DEBUG SHIT ENDS!!!
        


        //Empty dealer's hand
        this._dealerhand = [];

        //Deal dealer's card
        this._dealerhand.push(deck.hit);
        
        //Create and empty new hands for players
        for (var i = 0; i < playersthisround.length; i++) {
            var handarr = [];
            handarr.push(new hand.Hand(playersthisround[i], deck))
            playersthisround[i].handobjects = handarr
        }
        //Deal new starting cards
        for (var twice = 0; twice < 2; twice++){
            for (var i = 0; i < playersthisround.length; i++){
                for (var i2 = 0; i2 < playersthisround[i].handobjects.length; i2++){
                    playersthisround[i].handobjects[i2].hit = deck.hit
                }
            }
        }
        

        //Print out what the starting situation is.
        console.log("The dealer's cards are: " + this._dealerhand);
        
        for (var i = 0; i < playersthisround.length; i++){
            var handstring = ""
            for (var i2 = 0; i2 < playersthisround[i].handobjects.length; i2++) {
                handstring += String(playersthisround[i].handobjects[i2].hand)
                if (playersthisround[i].handobjects.length > 1 && i2 != playersthisround[i].handobjects[i2].length) {
                handstring += " - "
                }
            }
            
            console.log("Player: " + playersthisround[i].name + " - you have: " + handstring)
        }
        

        //Ask users for input
        for (var i = 0; i < playersthisround.length; i++){
            for (var i2 = 0; i2 < playersthisround[i].handobjects.length; i2++) {
            //Do until a valid action is given
                var inputtext = playersthisround[i].name + " what would you like to do with the hand:" + playersthisround[i].handobjects[i2].hand + "? Your options are: " + playersthisround[i].handobjects[i2].possibleactions
                new Promise(resolve => {
                playersthisround[i].handobjects[i2].quedaction = input.getinput(inputtext, playersthisround[i].handobjects[i2].possibleactions);
                resolve(playersthisround[i].quedaction);
            })
            }

            

            
            
            

        }  
        
    }
    set dealerhand(dealerhand) {
        this._dealerhand = dealerhand;
    }
    get dealerhand() {
        return this._dealerhand;
    }
}





module.exports = { Table };