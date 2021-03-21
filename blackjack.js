const participants = require("./participants");
const jackengine = require("./jackengine");


var testparticipantarray = [];

var jack = new participants.Player("jack", "123123123", "0", "100000");
var bobby = new participants.Player("bobby", "789789", "0", "100000");
testparticipantarray.push(jack);
testparticipantarray.push(bobby);
var table1 = new jackengine.Table(testparticipantarray);

