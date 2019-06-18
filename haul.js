module.exports = {
 bagArguments: function (args) {
    var array_length = args.length;
    var cp = 0;
    var sp = 0;
    var gp = 0;
    var pp = 0;
    var pass = false;
    var stuff = [];
    var inventory = false;
    var deposit = false;
    var withdraw = false;
    var wipe = false;
    var liquidate = false; // will take the monies and set them to their lowest number of coins
    var split = false; // will split the coins, which also liquidates them 
    var r = [];
    var i;
    for (i = 0; i < array_length; i++) {
        pass = false;
        if (args[i] == "i" || args[i] == "inv" || args[i] == "inventory") { inventory = true; pass = true; }
        if (args[i] == "d" || args[i] == "dp" || args[i] == "deposit") { deposit = true; pass = true; }
        if (args[i] == "w" || args[i] == "with" || args[i] == "withdraw") { withdraw = true; pass = true; }
        if (args[i] == "nuke" || args[i] == "wipe") { wipe = true; pass = true; }
        if (args[i] == "split") { split = true; pass = true; }
        if (args[i] == "liquidate") { liquidate = true; pass = true; }
        if (args[i].includes("cp")) { cp = cp + parseInt(args[i].split("cp")[0]); pass = true; }
        if (args[i].includes("sp")) { sp = sp + parseInt(args[i].split("sp")[0]); pass = true; }
        if (args[i].includes("gp")) { gp = gp + parseInt(args[i].split("gp")[0]); pass = true; }
        if (args[i].includes("pp")) { pp = pp + parseInt(args[i].split("pp")[0]); pass = true; }
        if (pass == false) { stuff.push(args[i]); }
    }
    r[0] = cp;
    r[1] = sp;
    r[2] = gp;
    r[3] = pp;
    r[4] = stuff;
    r[5] = inventory;
    r[6] = deposit;
    r[7] = withdraw;
    r[8] = split;
    r[9] = liquidate;
    r[10] = wipe;
    return r;
 },
 checkForBag: function () {
    var fs = require("fs");
    var jsonfile = require('jsonfile');
    if (fs.existsSync("./bagofholding.json")) {
        return true;
    } else {
        var bagobj = { bag_contents: [
            ['name', 'Magus McSmartypants'],
            ['cp', 0],
            ['sp', 0],
            ['gp', 0],
            ['pp', 0],
            ['stuff', ['staff of the magi','robes of the archmage','ferret']]
        ] };
        var bagjson = JSON.stringify(bagobj);
        fs.writeFile("./bagofholding.json", bagjson, 'utf8');
    }
    return true;
 },
 splitArguments: function (args) {
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
 },
 splitHaul: function (ways,haul) {
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
};

