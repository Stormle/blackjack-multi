
const hand = require("./hand");
class Player { 

    constructor(playername, discordid, tableid, balance) {  
      this._name = playername;
      this._discordid = discordid;
      this._tableid = tableid;
      this._balance = balance;
      this._handobjects = [];
      this._currentbet = 0;
      this._quedaction = "";

    }
    set handobjects(handobjects) {
        this._handobjects = handobjects;
    }
    set originalbet(originalbet) {
        this._originalbet = originalbet;
        this.currentbet = originalbet;
    }
    get originalbet() {
        return this._originalbet;
    }
    get handobjects() {
        return this._handobjects;
    }
    set balance(balance) {
        this._balance = balance;
    }
    
    get balance() {
        return this._balance;
    }
    set name(name) {
        this._name = name;
    }
    get name() {
        return this._name;
    }

    set currentbet(currentbet) {
        this._currentbet = currentbet;
    }
    get currentbet() {
        return this._currentbet;
    }  
    set quedaction(quedaction) {
        this._quedaction = quedaction;
    }
    get quedaction() {
        return this._quedaction;
    }
    get split() {
        return this._split;
    }
    
 


  } 
    
  


module.exports = { Player };