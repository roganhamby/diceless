var Discord = require('discord.io');
const auth = require('./auth.json');
const bag = require('./bag.js');
const rolling = require('./roll.js');
const util = require('./util.js');
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
    console.info('Connected');
    console.info('Logged in as: ');
    console.info(bot.username + ' - (' + bot.id + ')');
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
        var badparams = false;
        var msg;
        args = args.splice(1);
        switch(cmd) {
            case 'bag':
                bag.checkForBag(userID);
                returned_args = bag.bagArguments(args);
                var cp = returned_args[0];
                var sp = returned_args[1];
                var gp = returned_args[2];
                var pp = returned_args[3];
                var stuff = returned_args[4];
                var deposit = returned_args[5];
                var withdraw = returned_args[6];
                var split = returned_args[7];
                var consolidate = returned_args[8];
                badparams = false;                            
                msg = "The ferrets are waiting.";
                if (deposit == true && withdraw == true) { badparams = true; msg = "You can't have depoit and withdraw on the same command."; }
                if (deposit == false && withdraw == false && split == false && consolidate == false) { badparams = true; msg = "You haven't given the ferrets anything to do.  They are now bored."; }
                if (badparams == false) {
                    //if (consolidate == true) { msg = msg + " " + bag.consolidate; } 
                    if (deposit == true || withdraw == true) { msg = msg + " " + bag.depositOrWithdraw(userID,returned_args); }
                    if (consolidate == true) { bag.consolidate(userID); msg = msg + " " + "Monies have been consolidated."; }
                }
                msg = msg + bag.inventory(userID);
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
           case 'fate':
                returned_args = rolling.fateArguments(args);
                modifier = returned_args[0];
                msg = rolling.fateDice(modifier);
                msg = user + msg;
                if (typeof comment !== 'undefined') { msg = msg + "\n" + "#" + comment; }
                bot.sendMessage({
                    to: channelID,
                    message: msg
                });
           break;
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
           case 'split':
                returned_args = bag.splitArguments(args);
                var ways = returned_args[0];
                var haul = returned_args[1];
                if (ways !== 0) { msg = bag.splitHaul(ways,haul); } 
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
                msg = msg + "    /fate +3 #rolls 4dFATE DICE and gives result type\n";
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
