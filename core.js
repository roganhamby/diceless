var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
function generateRandomNumber(max) {
    var r = Math.floor(Math.random() * max) +1;
    return r;
}
function rollDice(user, theroll, rr) {
    var roll = theroll.split("d");
    var die = roll[1];
    var num = roll[0];
    var i;
    var res;
    var msg = user + "'s roll(s) for " + theroll + " are: ";
    var total = 0;
    var badresult;
    logger.info("rr is " + rr);
    for (i = 0; i < num; i++) {
        res = generateRandomNumber(die);
        if (res <= rr) {
            i--;
            badresult = strikeThrough(res);
            res = 0; 
            msg = msg + badresult + " "; 
        } else { msg = msg + res + " "; }
        total = total + res;
    }
    msg = msg + "... total is " + total;
    return msg;
}
function strikeThrough(result) {
    var x = result.toString();
    var a = x.split('');
    var b = a.map(char => char + '\u0336');
    var c = b.join('');
    return c;
}
function summonTrinket() {
    var fs = require("fs");
    var contents = fs.readFileSync("trinkets.json");
    var jsonContent = JSON.parse(contents);
    var r = generateRandomNumber(jsonContent.length);
    var x = jsonContent[r];
    return x; 
}
function insultBerk(berk) {
    if (berk.toLowerCase() == "rogan") { x = ' is the totoro, progenitor, source of love and wisdom.' } else {
        var fs = require("fs");
        var contents = fs.readFileSync("insults.json");
        var jsonContent = JSON.parse(contents);
        var r = generateRandomNumber(jsonContent.length);
        var x = jsonContent[r];
    }
    x = berk + x; 
    return x;
}
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '/') {
        cleaned = message.substring(1);
        cleaned = cleaned.replace(/ +(?= )/g,'');
        var args = cleaned.split(' ');
        var cmd = args[0];
        var argx = args[1];
        var argy = args[2];
        var argz = args[3];
        var msg;

        args = args.splice(1);
        switch(cmd) {
            case 'roll':
                var rr = 0;
                if (typeof argy !== 'undefined') {
                    rr = argy.split("rr")[1];
                }               
                msg = rollDice(user,argx,rr);
                bot.sendMessage({
                    to: channelID,
                    message: msg
                });
            break;
            case 'insult':
                msg = insultBerk(argx);
                bot.sendMessage({
                    to: channelID,
                    message: msg
                });
            break;
            case 'trinket':
                msg = summonTrinket();
                msg = "Trinket: " + msg;
                bot.sendMessage({
                    to: channelID,
                    message: msg
                });
            break;
         }
     }
});

