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
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '/') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            case 'roll':
                bot.sendMessage({
                    to: channelID,
                    message: 'hi Rogan'
                });
            break;
            case 'whois':
                bot.sendMessage({
                    to: channelID,
                    message: 'Rogan is the progenitor, source of all love and wisdom.'
                });
            break;
            case 'trinket':
                var m = summonTrinket();
                m = "Trinket: " + m;
                bot.sendMessage({
                    to: channelID,
                    message: m
                });
            break;
         }
     }
});

