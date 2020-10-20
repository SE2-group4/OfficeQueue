/**
 * prepare a testing DB
 * read queries from the <sql_file> and run them against the testing DB
 * 
 * @author Gastaldi Paolo
*/

'use strict';

function prepare(cb, flag) {
    const db_file = './testing.db';
    const sqlite = require('sqlite3');
    const db = new sqlite.Database(db_file, (err) => {
        if(err) 
            console.log("Error creating DB connection!");
    });
    const fs = require('fs');

    let count = 0; // line counter

    if(flag) console.log("Preparing your DB...");

    const dataSql = fs.readFileSync('./testing.sql').toString();
    const dataArr = dataSql.toString().split(';');

    db.serialize(() => {
        // db.run runs your SQL query against the DB
        db.run('PRAGMA foreign_keys=OFF;');
        db.run('BEGIN TRANSACTION;');
        // Loop through the `dataArr` and db.run each query
        dataArr.forEach((query) => {
            count++;
            if(query) {
                db.run(query, (err) => {
                    if(err && flag){
                        console.error(`> Error in line ${count}`);
                        console.error(err);
                    }
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
        if(flag) console.log("The testing DB is ready, enjoy! :)");

        if(cb) cb();
    });
}

prepare();

module.exports = prepare;