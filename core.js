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
function rollDNDStats(user,rr,drop) {
    var theroll = "3d6";
    if (drop == 'lowest') { theroll = "4d6"; } 
        else { drop = 'none'; } //safeguard against someone passing dph to dndstats
    var i;
    var line;
    var msg = user + "'s stats rolls are: \n";
    for (i = 0; i < 6; i++) {
        line = rollDice(theroll, rr, drop);
        msg = msg + line + "\n";
    }
    return msg;
}
function rollDice(theroll, rr, drop) {
    var roll = theroll.split("d");
    var die = roll[1];
    var num = roll[0];
    var additive = 0;
    var subtractive = 0;
    var modifier = 0;
    var split_die;
    var i;
    var lowest = die + 1;
    var highest = 0;
    var res;
    var msg = theroll + " and dice gods giveth  ";
    var total = 0;
    var badresult;
    if (die.includes("-")) { 
        subtractive = 1; 
        split_die = die.split("-"); 
        modifier = split_die[1];
        die = split_die[0];
    }
    if (die.includes("+")) {
        additive = 1; 
        split_die = die.split("+"); 
        modifier = split_die[1];
        die = split_die[0];
    }
    for (i = 0; i < num; i++) {
        res = generateRandomNumber(die);
        if (res > highest) { highest = res; }
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
    if (additive == 1) { total = total + parseInt(modifier); }
    if (subtractive == 1) { total = total - parseInt(modifier); }
    if (drop == 'none') { 
        msg = msg + "... total is " + total; 
    } 
    if (drop == 'lowest') {
        total = total - lowest;
        msg = msg + "drop lowest of " + lowest + "... total is " + total; 
    }
    if (drop == 'highest') {
        total = total - highest;
        msg = msg + "drop highest of " + highest + "... total is " + total; 
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
        var cleaned;
        var comment;
        var msg_split;
        cleaned = message.substring(1);
        cleaned = cleaned.replace(/ +(?= )/g,'');
        msg_split = cleaned.split("#");
        cleaned = msg_split[0];
        comment = msg_split[1];
        var args = cleaned.split(' ');
        var cmd = args[0];
        var argx = args[1];
        var argy = args[2];
        var argz = args[3];
        var rr = 0;
        var drop = 'none';
        var roll;
        var msg;
        if (typeof argx !== 'undefined') {
            if (argx == "dpl") { drop = 'lowest'; }
            if (argx == "dph") { drop = 'highest'; }
            if (argx.includes("rr")) { rr = argx.split("rr")[1]; }
            if (argx.includes("d") && argx != 'dpl' && argx != 'dph') { roll = argx; }
        }
        if (typeof argy !== 'undefined') {
            if (argy == "dpl") { drop = 'lowest'; }
            if (argy == "dph") { drop = 'highest'; }
            if (argy.includes("rr")) { rr = argy.split("rr")[1]; }
            if (argy.includes("d") && argy != 'dpl' && argy != 'dph') { roll = argy; }
        }
        if (typeof argz !== 'undefined') {
            if (argz == "dpl") { drop = 'lowest'; }
            if (argz == "dph") { drop = 'highest'; }
            if (argz.includes("rr")) { rr = argz.split("rr")[1]; }
            if (argz.includes("d") && argz != 'dpl' && argz != 'dph') { roll = argz; }
        }
        args = args.splice(1);
        switch(cmd) {
            case 'roll':
                logger.info("drop is " + drop);
                msg = rollDice(roll,rr,drop);
                msg = user + " rolls " + msg;
                if (typeof comment !== 'undefined') { msg = msg + "\n" + "#" + comment; }
                bot.sendMessage({
                    to: channelID,
                    message: msg
                });
            break;
            case 'dndstats':
                msg = rollDNDStats(user,rr,drop);
                if (typeof comment !== 'undefined') { msg = msg + "\n" + "#" + comment; }
                bot.sendMessage({
                    to: channelID,
                    message: msg
                });
            break;
            case 'insult':
                msg = insultBerk(argx);
                if (typeof comment !== 'undefined') { msg = msg + "\n" + "#" + comment; }
                bot.sendMessage({
                    to: channelID,
                    message: msg
                });
            break;
            case 'trinket':
                msg = summonTrinket();
                msg = "Trinket: " + msg;
                if (typeof comment !== 'undefined') { msg = msg + "\n" + "#" + comment; }
                bot.sendMessage({
                    to: channelID,
                    message: msg
                });
            break;
         }
     }
});

