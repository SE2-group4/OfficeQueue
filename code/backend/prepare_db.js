/**
 * functions to prepare a testing DB
 * 
 * @author Gastaldi Paolo
*/

'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('./testing.db', (err) => {
    if(err) 
        console.log("Error creating DB connection!");
});
const fs = require('fs');

let count = 0; // line counter

console.log("Preparing your DB...");

const dataSql = fs.readFileSync('./testing.sql').toString();
const dataArr = dataSql.toString().split(';');

db.serialize(() => {
    // db.run runs your SQL query against the DB
    db.run('PRAGMA foreign_keys=OFF;');
    db.run('BEGIN TRANSACTION;');
    // Loop through the `dataArr` and db.run each query
    dataArr.forEach((query) => {
        if(query) {
            db.run(query, (err) => {
                if(err) throw err;
            });
        }
    });
    db.run('COMMIT;');
});

// Close the DB connection
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("The testing DB is ready, enjoy! :)");
});