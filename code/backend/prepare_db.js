/* prepare a testing DB
 * read queries from the <sqlFile> and run them against the testing DB
 * 
 * @author Gastaldi Paolo
 */
'use strict';
const sqlite = require('sqlite3');
const fs = require('fs');

exports.setup = function(dbpath) {
    return new Promise((resolve, reject) => {
        const sqlFile = "./testing.sql";
        const dbPath = dbpath;
        const db = new sqlite.Database(dbPath, (err) => {
            if(err) 
                console.log("Error creating DB connection!");
        });
        console.log("Resetting the database at '" + dbPath + "' ...");

        let count = 0; // line counter

        const dataSql = fs.readFileSync(sqlFile).toString();
        const dataArr = dataSql.toString().split(';');
        dataArr.forEach((str, index, array) => {
            array[index] = str.replace(/(\r\n|\n|\r)/gm, "");
        });

        db.serialize(() => {
            // db.run runs your SQL query against the DB
            db.run('PRAGMA foreign_keys=OFF;');
            db.run('BEGIN TRANSACTION;');
            // Loop through the `dataArr` and db.run each query
            dataArr.forEach((query) => {
                count++;
                //console.log(query);
                if(query) {
                    db.run(query, (err) => {
                        if(err) {
                            console.error(`> Error in line ${count} query:${query}`);
                            console.error(err);
                        }
                    });
                }
            });

            db.run('COMMIT;');

            db.close((err) => {
                if (err) {
                    reject(err.message);
                }
                resolve(`The database at '${dbPath}' is ready, enjoy! :)`);
            });
        });
    });
}
