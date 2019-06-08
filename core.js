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
function summonTrinket() {
    var fs = require("fs");
    var contents = fs.readFileSync("trinkets.json");
    var jsonContent = JSON.parse(contents);
    var r = Math.floor(Math.random() * (jsonContent.length - 1) * 1);
    var x = jsonContent[r];
    return x; 
}
function insultBerk(berk) {
    if (berk.toLowerCase() == "rogan") { x = ' is the totoro, progenitor, source of love and wisdom.' } else {
        var fs = require("fs");
        var contents = fs.readFileSync("insults.json");
        var jsonContent = JSON.parse(contents);
        var r = Math.floor(Math.random() * (jsonContent.length - 1) * 1);
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
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        var argx = args[1];
        var argy = args[2];
        var argz = args[3];
        var msg;

        args = args.splice(1);
        switch(cmd) {
            case 'roll':
                bot.sendMessage({
                    to: channelID,
                    message: 'hi Rogan'
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

