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
function splitArguments(args) {
    var array_length = args.length;
    var ways = 0;
    var haul = 0;
    var r = [];
    var i;
    for (i = 0; i < array_length; i++) {
        if (args[i].includes("ways")) { ways = args[i].split("ways")[0]; }
        if (args[i].includes("cp")) { haul = haul + parseInt(args[i].split("cp")[0]); }
        if (args[i].includes("sp")) { haul = haul + (parseInt(args[i].split("cp")[0]) * 10); }
        if (args[i].includes("gp")) { haul = haul + (parseInt(args[i].split("gp")[0]) * 100); }
        if (args[i].includes("pp")) { haul = haul + (parseInt(args[i].split("pp")[0]) * 1000); }
    }
    r[0] = ways;
    r[1] = haul;
    return r;
}
function rollArguments(args) {
    var array_length = args.length;
    var roll;
    var drop = 'none';
    var rr = 0;
    var r = [];
    var i;
    for (i = 0; i < array_length; i++) {
        if (args[i] == "dpl") { drop = 'lowest'; }
        if (args[i] == "dph") { drop = 'highest'; }
        if (args[i].includes("rr")) { rr = args[i].split("rr")[1]; }
        if (args[i].includes("d") && args[i] != 'dpl' && args[i] != 'dph') { roll = args[i]; }
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
    var pass = 1;
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
    if (Number.isInteger(parseInt(rr)) == false) { pass = 0; }
    if (Number.isInteger(parseInt(die)) == false) { pass = 0; }
    if (Number.isInteger(parseInt(num)) == false) { pass = 0; }
    if (Number.isInteger(parseInt(modifier)) == false) { pass = 0; }
    if (pass == 0) { msg = 'Natural -1. Please check your command syntax.'; }
    return msg;
}
function splitHaul(ways,haul) {
    var per_div = Math.round(haul / ways);
    var per_mod = haul % ways;
    // per player
    var leftovers;
    var pp = Math.round(per_div / 1000);
    leftovers = per_div % 1000;
    var gp = Math.round(leftovers / 100);
    leftovers = leftovers % 100;
    var sp = Math.round(leftovers / 10);
    var cp = leftovers % 10;
    var r = "Each party member gets " + pp + " platinum, " + gp + " gold, " + sp + " silver, " + cp + " copper.\n There is " + per_mod + " coopper left over.";
    return r; 
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
           case 'split':
                returned_args = splitArguments(args);
                var ways = returned_args[0];
                var haul = returned_args[1];
                if (ways !== 0) { msg = splitHaul(ways,haul); } 
                    else { msg = 'You have to tell us how many party members to split it up among.'; }
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
            case 'diceless':
                msg = "Diceless supports the following commands:\n";
                msg = msg + "    /trinket #gives one from a random list of items\n";
                msg = msg + "    /roll 3d6+2 dpl rr2 #make roll, drop lowest reroll 2s and 1s\n";
                msg = msg + "    /dndstats rr1 #rolls 3d6 six times and rerolls 1s\n";
                msg = msg + "    /dndstats dpl #rolls 4d6 six times and rerolls 1s\n";
                msg = msg + "    /split 4pp 3gp 2cp 8cp 7sp 9pp 5 ways #adds up the money and splits it\n";
                msg = msg + "# comments will append comments to the response from the bot #see README for more info\n";
                msg = msg + "source at https://github.com/roganhamby/diceless\n";
                msg = msg + "project tracking at https://trello.com/b/RN9kMwiS/diceless\n";
                bot.sendMessage({
                    to: channelID,
                    message: msg
                });
            break;
         }
     }
});

