module.exports = {
 fateArguments: function (args) {
    var array_length = args.length;
    var logger = require('winston');
    var roll = '4d3';
    var offset = 0;
    var split_offset;
    var r = [];
    var i;
    for (i = 0; i < array_length; i++) {
        if (args[i].includes("+") && !args[i].includes("d")) {
                split_offset = args[i].split("+");
                offset = offset + parseInt(split_offset[1]);
            };
        if (args[i].includes("-") && !args[i].includes("d")) {
                split_offset = args[i].split("-");
                offset = offset - parseInt(split_offset[1]);
            };
    };
    if (roll.includes("+")) {
        split_offset = roll.split("+");
        offset = offset + parseInt(split_offset[1]);
        roll = split_offset[0];
    }
    if (roll.includes("-")) {
        split_offset = roll.split("-");
        offset = offset - parseInt(split_offset[1]);
        roll = split_offset[0];
    }
    r[0] = offset;
    return r;
 },
 fateDice: function (modifier) {
    var logger = require('winston');
    var die = 3;
    var num = 4;
    var i;
    var msg = " rolls the dice and fate giveth  ";
    var total_msg;
    var total = 0;
    var pass = 1;
    var util = require('./util.js');
    for (i = 0; i < num; i++) {
        res = util.generateRandomNumber(die);
        if (res == 1) { res = -1; }
        if (res == 2) { res = 0; }
        if (res == 3) { res = 1; }
        msg = msg + res + " ";
        total = total + res;
    }
    total = total + modifier;
    switch(true) {
        case total > 7: total_msg = " Legendary."; break;
        case total == 7: total_msg = " Epic."; break;
        case total == 6: total_msg = " Fantastic."; break;
        case total == 5: total_msg = " Superb."; break;
        case total == 4: total_msg = " Great."; break;
        case total == 3: total_msg = " Good."; break;
        case total == 2: total_msg = " Fair."; break;
        case total == 1: total_msg = " Average."; break;
        case total == 0: total_msg = " Mediocre."; break;
        case total == -1: total_msg = " Poor."; break;
        case total < -1: total_msg = " Terrible."; break;
    } 
    msg = msg + "... total is " + total + ", FATE roll quality is" + total_msg;
    if (Number.isInteger(parseInt(modifier)) == false) { pass = 0; }
    if (pass == 0) { msg = 'Natural -1. Please check your command syntax.'; }
    return msg;
 },
 rollArguments: function (args) {
    var array_length = args.length;
    var logger = require('winston');
    var roll = '1d1';
    var drop = 'none';
    var rr = 0;
    var offset = 0;
    var multiplier = 0;
    var split_offset;
    var r = [];
    var i;
    for (i = 0; i < array_length; i++) {
        if (args[i] == "dpl") { drop = 'lowest'; }
        if (args[i] == "dph") { drop = 'highest'; }
        if (args[i].includes("rr")) { rr = args[i].split("rr")[1]; }
        if (args[i].includes("d") && args[i] != 'dpl' && args[i] != 'dph') { roll = args[i]; }
        if (args[i].includes("+") && !args[i].includes("d")) {
                split_offset = args[i].split("+");
                offset = offset + parseInt(split_offset[1]);
            };
        if (args[i].includes("-") && !args[i].includes("d")) {
                split_offset = args[i].split("-");
                offset = offset - parseInt(split_offset[1]);
            };
        if (args[i].includes("*") && !args[i].includes("d")) {
                split_offset = args[i].split("*");
                if (split_offset[1] == 1) { split_offset[1] = 0; }
                multiplier = multiplier + parseInt(split_offset[1]);
            }
        if (args[i].includes("/") && !args[i].includes("d")) {
                split_offset = args[i].split("/");
                if (split_offset[1] == 1) { split_offset[1] = 0; }
                multiplier = multiplier - parseInt(split_offset[1]);
            }
    };
    if (roll.includes("+")) {
        split_offset = roll.split("+");
        offset = offset + parseInt(split_offset[1]);
        roll = split_offset[0];
    }
    if (roll.includes("-")) {
        split_offset = roll.split("-");
        offset = offset - parseInt(split_offset[1]);
        roll = split_offset[0];
    }
    r[0] = roll;
    r[1] = rr;
    r[2] = drop;
    r[3] = offset;
    r[4] = multiplier;
    return r;
 },
 rollDice: function (theroll, rr, drop, modifier, multiplier) {
    var roll = theroll.split("d");
    var die = roll[1];
    var num = roll[0];
    var split_die;
    var i;
    var lowest = parseInt(die) + 1;
    var highest = 0;
    var res;
    var msg = theroll + " and dice gods giveth  ";
    var total = 0;
    var badresult;
    var pass = 1;
    var util = require('./util.js');
    for (i = 0; i < num; i++) {
        res = util.generateRandomNumber(die);
        if (res <= rr) {
            i--;
            badresult = util.strikeThrough(res);
            res = 0;
            msg = msg + badresult + " ";
        } else {
            if (res < lowest) { lowest = parseInt(res); }
            if (res > highest) { highest = parseInt(res); }
            msg = msg + res + " ";
        }
        total = total + res;
    }
    total = total + modifier;
    if (multiplier > 0) { total = parseInt(total) * parseInt(multiplier); }
    if (multiplier < 0) { 
        multiplier = parseInt(multiplier) * -1;
        total = Math.floor(parseInt(total) / parseInt(multiplier)); 
    }
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
};
