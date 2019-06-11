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
function rollArguments(args) {
    var a = args[0];
    var b = args[1];
    var c = args[2];
    var d = args[3];
    var e = args[4];
    var roll;
    var drop = 'none';
    var rr = 0;
    var r = [];
    if (typeof a !== 'undefined') {
        if (a == "dpl") { drop = 'lowest'; }
        if (a == "dph") { drop = 'highest'; }
        if (a.includes("rr")) { rr = a.split("rr")[1]; }
        if (a.includes("d") && a != 'dpl' && a != 'dph') { roll = a; }
    }
    if (typeof b !== 'undefined') {
        if (b == "dpl") { drop = 'lowest'; }
        if (b == "dph") { drop = 'highest'; }
        if (b.includes("rr")) { rr = b.split("rr")[1]; }
        if (b.includes("d") && b != 'dpl' && b != 'dph') { roll = b; }
    }
    if (typeof c !== 'undefined') {
        if (c == "dpl") { drop = 'lowest'; }
        if (c == "dph") { drop = 'highest'; }
        if (c.includes("rr")) { rr = c.split("rr")[1]; }
        if (c.includes("d") && c != 'dpl' && c != 'dph') { roll = c; }
    }
    if (typeof d !== 'undefined') {
        if (d == "dpl") { drop = 'lowest'; }
        if (d == "dph") { drop = 'highest'; }
        if (d.includes("rr")) { rr = d.split("rr")[1]; }
        if (d.includes("d") && d != 'dpl' && d != 'dph') { roll = d; }
    }  
    if (typeof e !== 'undefined') {
        if (e == "dpl") { drop = 'lowest'; }
        if (e == "dph") { drop = 'highest'; }
        if (e.includes("rr")) { rr = e.split("rr")[1]; }
        if (e.includes("d") && e != 'dpl' && e != 'dph') { roll = e; }
    }  
    if (typeof roll == 'undefined') {
        if (drop == 'lowest' || drop == 'highest') { roll = '2d20'; } 
            else { roll = '1d20'; }
    }
    r[0] = roll;
    r[1] = rr;
    r[2] = drop;
    return r;
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
    var lowest = parseInt(die) + 1;
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
        if (res <= rr) {
            i--;
            badresult = strikeThrough(res);
            res = 0; 
            msg = msg + badresult + " "; 
        } else {
            if (res < lowest) { lowest = parseInt(res); }     
            if (res > highest) { highest = parseInt(res); }
            msg = msg + res + " "; 
        }
        total = total + res;
    }
    if (additive == 1) { total = parseInt(total) + parseInt(modifier); }
    if (subtractive == 1) { total = parseInt(total) - parseInt(modifier); }
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
        var returned_args;
        var rr;
        var drop;
        var roll;
        var msg;
        args = args.splice(1);
        switch(cmd) {
            case 'roll':
                returned_args = rollArguments(args);
                roll = returned_args[0];
                rr = returned_args[1];
                drop = returned_args[2];
                msg = rollDice(roll,rr,drop);
                msg = user + " rolls " + msg;
                if (typeof comment !== 'undefined') { msg = msg + "\n" + "#" + comment; }
                bot.sendMessage({
                    to: channelID,
                    message: msg
                });
            break;
            case 'dndstats':
                returned_args = rollArguments(args);
                roll = returned_args[0];
                rr = returned_args[1];
                drop = returned_args[2];
                msg = rollDNDStats(user,rr,drop);
                if (typeof comment !== 'undefined') { msg = msg + "\n" + "#" + comment; }
                bot.sendMessage({
                    to: channelID,
                    message: msg
                });
            break;
            case 'insult':
                var berk = args[0];
                if (typeof berk !== 'undefined') { msg = insultBerk(berk); } else 
                    { msg = "I'm not going to, like, insult myself dude."; }
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

