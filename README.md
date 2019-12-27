# rest-api

Getting started:
$ cd rest-api
$ npm install
$ nodemon app.js

See also:
  https://www.youtube.com/watch?v=EE8ZTQxa0AM
  https://flaviocopes.com/node-mongodb/
  https://www.thepolyglotdeveloper.com/2019/01/getting-started-mongodb-docker-container-deployment/
  https://www.w3schools.com/nodejs/nodejs_mongodb_insert.asp

Google Calendar API:
  https://developers.google.com/calendar/quickstart/nodejs


// var Db = require('mongodb').Db,
//     MongoClient = require('mongodb').MongoClient,
//     Server = require('mongodb').Server,
//     ReplSetServers = require('mongodb').ReplSetServers,
//     ObjectID = require('mongodb').ObjectID,
//     Binary = require('mongodb').Binary,
//     GridStore = require('mongodb').GridStore,
//     Grid = require('mongodb').Grid,
//     Code = require('mongodb').Code,
//     BSON = require('mongodb').pure().BSON,
//     assert = require('assert');

POST localhost:3003/users
{
    "SSN": "333333333",
    "client_id": "44",
    "phone": {
    	"home": "408-640-6902",
    	"work": "415-696-3793"
    },
    "email" : {
    	"home": "grhex1@gmail.com",
    	"work": "cfrank@salesforce.com"
    },
    "name": {
        "frist": "Colin",
        "last": "Frank"
    }
}



https://github.com/cafrank/rest-api.git