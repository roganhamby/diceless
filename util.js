module.exports = {
 generateRandomNumber: function (max) {
    var r = Math.floor(Math.random() * max) +1;
    return r;
 },
 strikeThrough: function (result) {
    var x = result.toString();
    var a = x.split('');
    var b = a.map(char => char + '\u0336');
    var c = b.join('');
    return c;
 }
};
