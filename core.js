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
function rollDNDStats(user,rr,dpl) {
    var theroll = "3d6";
    if (dpl == 1) { theroll = "4d6"; }
    var i;
    var line;
    var msg = user + "'s stats rolls are: \n";
    for (i = 0; i < 6; i++) {
        line = rollDice(theroll, rr, dpl);
        msg = msg + line + "\n";
    }
    return msg;
}
function rollDice(theroll, rr, dpl) {
    var roll = theroll.split("d");
    var die = roll[1];
    var num = roll[0];
    var i;
    var lowest = die + 1;
    var res;
    var msg = theroll + " and the dice gods giveth  ";
    var total = 0;
    var badresult;
    for (i = 0; i < num; i++) {
        res = generateRandomNumber(die);
        if (res <= rr) {
            i--;
            badresult = strikeThrough(res);
            res = 0; 
            msg = msg + badresult + " "; 
        } else {
            if (res < lowest) { lowest = res; }     
            msg = msg + res + " "; 
        }
        total = total + res;
    }
    if (dpl == 0) { 
            msg = msg + "... total is " + total; 
        } else { 
            total = total - lowest;
            msg = msg + "drop lowest of " + lowest + "... total is " + total; 
        }
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
        //args = args.splice(1);
        var cmd = args[0];
        var argx = args[1];
        var argy = args[2];
        var argz = args[3];
        var rr = 0;
        var dpl = 0;
        var roll;
        var msg;
        if (typeof argx !== 'undefined') {
            if (argx == "dpl") { dpl = 1; }
            if (argx.includes("rr")) { rr = argx.split("rr")[1]; }
            if (argx.includes("d") && argx != 'dpl') { roll = argx; }
        }
        if (typeof argy !== 'undefined') {
            if (argy == "dpl") { dpl = 1; }
            if (argy.includes("rr")) { rr = argy.split("rr")[1]; }
            if (argy.includes("d") && argy != 'dpl') { roll = argy; }
        }
        if (typeof argz !== 'undefined') {
            if (argz == "dpl") { dpl = 1; }
            if (argz.includes("rr")) { rr = argz.split("rr")[1]; }
            if (argz.includes("d") && argz != 'dpl') { roll = argz; }
        }
        args = args.splice(1);
        switch(cmd) {
            case 'roll':
                logger.info(roll + rr + dpl);
                msg = rollDice(roll,rr,dpl);
                msg = user + " rolls " + msg;
                bot.sendMessage({
                    to: channelID,
                    message: msg
                });
            break;
            case 'dndstats':
                msg = rollDNDStats(user,rr,dpl);
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

