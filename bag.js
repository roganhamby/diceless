module.exports = {
 bagArguments: function (args) {
    var array_length = args.length;
    var cp = 0;
    var sp = 0;
    var gp = 0;
    var pp = 0;
    var pass = false;
    var stuff = [];
    var deposit = false;
    var withdraw = false;
    var consolidate = false;
    var ways;
    var split = false; // will split the coins, which also liquidates them 
    var r = [];
    var i;
    for (i = 0; i < array_length; i++) {
        pass = false;
        if (args[i].includes("ways")) { ways = args[i]; }
        if (args[i] == "d" || args[i] == "dp" || args[i] == "deposit") { deposit = true; pass = true; }
        if (args[i] == "w" || args[i] == "with" || args[i] == "withdraw") { withdraw = true; pass = true; }
        if (args[i] == "split") { split = true; pass = true; }
        if (args[i] == "consolidate" || args[i] == "cons") { consolidate = true; pass = true; }
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
    r[5] = deposit;
    r[6] = withdraw;
    r[7] = split;
    r[8] = consolidate;
    r[9] = ways;
    return r;
 },
 checkForBag: function (userID) {
    var util = require('./util.js');
    var sql = "SELECT COUNT(*) AS c FROM inventory WHERE name = '" + userID + "';";
    var row = util.querySingleRow(sql);
    if (row.c == 0) {  
        sql = "INSERT INTO inventory (name,cp,sp,gp,pp,stuff) VALUES ('" + userID + "',0,0,0,0,'');";
        util.runSQL(sql);
    }
    return true;
 },
 consolidate: function (userID) {
    var util = require('./util.js');
    var sql = "SELECT cp, sp, gp, pp FROM inventory WHERE name = '" + userID + "';";
    var row = util.querySingleRow(sql);
    var moola = row.cp + (10 * row.sp) + (100 * row.gp) + (1000 * row.pp);
    var pp = Math.floor(moola / 1000);
    moola = moola % 1000;
    var gp = Math.floor(moola / 100);
    moola = moola % 100;
    var sp = Math.floor(moola / 10);
    var cp = moola % 10;
    sql = "UPDATE inventory SET cp = " + cp + ", sp = " + sp + ", gp = " + gp + ", pp = " + pp + " WHERE name = '" + userID + "';";
    util.runSQL(sql);
    return;
 },
 depositOrWithdraw: function (userID,args) {
    var util = require('./util.js');
    var cp = args[0];
    var sp = args[1];
    var gp = args[2];
    var pp = args[3];
    var stuff = args[4];
    var deposit = args[5];
    var withdraw = args[6];
    var msg;
    var sql = "SELECT cp, sp, gp, pp, stuff FROM inventory WHERE name = '" + userID + "';";
    var row = util.querySingleRow(sql);
    var row_stuff = row.stuff.split(' ');
    if (withdraw == true) {
        cp = row.cp - cp;
        sp = row.sp - sp;
        gp = row.gp - gp;
        pp = row.pp - pp;
        row_stuff = row_stuff.filter( function( el ) {
            return stuff.indexOf( el ) < 0;
        } ); 
        stuff = row_stuff;
    }
    if (deposit == true) {
        cp = cp + row.cp;
        sp = sp + row.sp;
        gp = gp + row.gp;
        pp = pp + row.pp;
        stuff = stuff.concat(row_stuff);
    }
    if (cp >= 0 && sp >= 0 && gp >= 0 && pp >= 0) {
        var stuff_string = stuff.join(' ');
        sql = "UPDATE inventory SET cp = " + cp + ", sp = " + sp + ", gp = " + gp + ", pp = " + pp + ", stuff = '" + stuff_string + "' WHERE name = '" + userID + "';";
        util.runSQL(sql);
        msg = "The ferrets have adjusted your wares.  Beware.";
    } else {
        msg = "The ferrets say your math doesn't work.  Don't scame a ferret.  They know people.";
    }
    return msg;
 },
 inventory: function (userID) {
    var util = require('./util.js');
    var sql = "SELECT cp, sp, gp, pp, stuff FROM inventory WHERE name = '" + userID + "';";
    var row = util.querySingleRow(sql);
    var msg = "\n Current bag contents: " + row.cp + " copper, " + row.sp + " silver, " + row.gp + " gold, " + row.pp + " platinum. " + row.stuff;
    return msg;
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
 splitFromDB: function (userID,ways) {
    var util = require('./util.js');
    ways = ways.split("ways")[0]; 
    var sql = "SELECT cp, sp, gp, pp FROM inventory WHERE name = '" + userID + "';";
    var row = util.querySingleRow(sql);
    var haul = row.cp + (10 * row.sp) + (100 * row.gp) + (1000 * row.pp);
    var per_div = Math.floor(haul / ways);
    var per_mod = haul % ways;
    var leftovers;
    var pp = Math.floor(per_div / 1000);
    leftovers = per_div % 1000;
    var gp = Math.floor(leftovers / 100);
    leftovers = leftovers % 100;
    var sp = Math.floor(leftovers / 10);
    var cp = leftovers % 10;
    var r = "Each party member gets " + pp + " platinum, " + gp + " gold, " + sp + " silver, " + cp + " copper.\n There is " + per_mod + " coopper left over.  Don't forget to /bagwipe if you are clearing EVERYTHING out.";
    return r;
 },
 splitHaul: function (ways,haul) {
    var per_div = Math.floor(haul / ways);
    var per_mod = haul % ways;
    var leftovers;
    var pp = Math.floor(per_div / 1000);
    leftovers = per_div % 1000;
    var gp = Math.floor(leftovers / 100);
    leftovers = leftovers % 100;
    var sp = Math.floor(leftovers / 10);
    var cp = leftovers % 10;
    var r = "Each party member gets " + pp + " platinum, " + gp + " gold, " + sp + " silver, " + cp + " copper.\n There is " + per_mod + " coopper left over.";
    return r;
 },
 wipe: function (userID) {
    var util = require('./util.js');
    sql = "UPDATE inventory SET cp = 0, sp = 0, gp = 0, pp = 0, stuff = NULL WHERE name = '" + userID + "';";
    util.runSQL(sql);
    return "The ferrets have left nothing behind.";
 }
};

