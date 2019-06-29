module.exports = {
 generateRandomNumber: function (max) {
    var r = Math.floor(Math.random() * max) +1;
    return r;
 },
 queryMultipleRows: function (sql) {
    const Database = require('better-sqlite3');
    const db = new Database('./diceless.db');
    const sql_stmt = db.prepare(sql);
    var rows = sql_stmt.all();
    db.close();
    return rows;
 },
 querySingleRow: function (sql) {
    const Database = require('better-sqlite3');
    const db = new Database('./diceless.db');
    const sql_stmt = db.prepare(sql);
    var row = sql_stmt.get();
    db.close();
    return row;
 },
 runSQL: function (sql) {
    const Database = require('better-sqlite3');
    const db = new Database('./diceless.db');
    const sql_stmt = db.prepare(sql);
    sql_stmt.run();
    db.close();
    return;
 },
 strikeThrough: function (result) {
    var x = result.toString();
    var a = x.split('');
    var b = a.map(char => char + '\u0336');
    var c = b.join('');
    return c;
 }
};
