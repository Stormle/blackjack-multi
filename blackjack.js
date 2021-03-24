const participants = require("./participants");
const jackengine = require("./jackengine");


var jack = new participants.Player("jack", "123123123", "0", "100000");
var bobby = new participants.Player("bobby", "789789", "0", "100000");

var table1 = new jackengine.Table();

table1.addplayer = jack;
table1.addplayer = bobby;

//Override players to join the game (debug stuff)
jack.originalbet = 10;
bobby.originalbet = 33;
table1._playersthisround.push(jack)
table1._playersthisround.push(bobby)
table1.tablestate = "round start"
table1.tick;
//Debug stuff ends