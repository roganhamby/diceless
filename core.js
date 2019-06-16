var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var haul = require('./haul.js');
var rolling = require('./roll.js');
var util = require('./util.js');
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
function rollDNDStats(user,rr,drop) {
    var theroll = "3d6";
    if (drop == 'lowest') { theroll = "4d6"; }
        else { drop = 'none'; } //safeguard against someone passing dph to dndstats
    var i;
    var line;
    var msg = user + "'s stats rolls are: \n";
    for (i = 0; i < 6; i++) {
        line = rolling.rollDice(theroll, rr, drop, 0, 0);
        msg = msg + line + "\n";
    }
    return msg;
}
function summonTrinket() {
    var fs = require("fs");
    var contents = fs.readFileSync("trinkets.json");
    var jsonContent = JSON.parse(contents);
    var r = util.generateRandomNumber(jsonContent.length);
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
        var modifier;
        var multiplier;
        var msg;
        args = args.splice(1);
        switch(cmd) {
            case 'roll':
                returned_args = rolling.rollArguments(args);
                roll = returned_args[0];
                rr = returned_args[1];
                drop = returned_args[2];
                modifier = returned_args[3];
                multiplier = returned_args[4];
                msg = rolling.rollDice(roll,rr,drop,modifier,multiplier);
                msg = user + " rolls " + msg;
                if (typeof comment !== 'undefined') { msg = msg + "\n" + "#" + comment; }
                bot.sendMessage({
                    to: channelID,
                    message: msg
                });
            break;
            case 'dndstats':
                returned_args = rolling.rollArguments(args);
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
                msg = msg + "    /roll 3d6 +2 *2 dpl rr2 #make roll, drop lowest reroll 2s and 1s\n";
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
