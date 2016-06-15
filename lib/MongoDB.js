"use strict";
/**
 * You must implement the methods in this
 * file to interact with the Mongo database.
 * 
 * Created by sdiemert on 2016-05-25.
 */

// See https://github.com/mongodb/node-mongodb-native for details.
var MongoClient = require("mongodb").MongoClient;
var DBAdapter   = require("./DBAdapter");


class MongoDB extends DBAdapter {

    constructor(u, p, db, host, port) {
        super(u, p, db, host, port);

        this._user   = u;
        this._passwd = p;
        this._dbname = db || "maxweb";
        this._host   = host || "localhost";
        this._port   = port || 27017;

        this._db = null;

    }

    /**
     * Connects to the database.
     * @param callback {function} called when the connection completes.
     *      Takes an error parameter.
     */
    connect(callback) {
        
        var that = this; 

        MongoClient.connect(
            "mongodb://" + this._host + ":" + this._port + "/" + this._dbname,
            function (err, db) {

                if (err) {
                    console.log("ERROR: Could not connect to database.");
                    that._db = null;
                    callback(err);
                } else {
                    console.log("INFO: Connected to database.");
                    that._db = db;
                    callback(null);
                }

            }
        );

    }

    /**
     * Closes the connection to the database.
     */
    close() {
        this._db.close();
    }

    /**
     * Queries the database for all tasks and returns them via the callback
     * function.
     *
     * @param callback {function} called when query finishes.
     *      Takes two parameters: 1) error parameter, 2) data returned from query.
     */
    getAllProjects(callback) {

        var col = this._db.collection('projects');

        col.find({}).toArray(function(err, docs) {
            if (!err)
                callback(null, docs);
            else callback(err,docs);
        });
        // TODO: IMPLEMENT ME
        // See https://github.com/mongodb/node-mongodb-native for details.

    }

    /**
     * Adds a task to the database.
     *
     * @param task {object} represents the task to be added to the DB.
     * @param callback {function} called when query finishes.
     *      Takes a single error parameter.
     */
    addProject(project, callback) {

        var col = this._db.collection('projects');

        col.updateOne({ iden : project.iden }, { $set: {iden: project.iden, name : project.name, tasks : project.tasks, time: project.time } }, {upsert:true},  function(err, result) {
            callback(result);
        });
        // TODO: IMPLEMENT ME
        // See https://github.com/mongodb/node-mongodb-native for details.
    }

}

module.exports = MongoDB; 
