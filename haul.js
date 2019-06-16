module.exports = {
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

