// Load 
// See also:
//   https://www.youtube.com/watch?v=EE8ZTQxa0AM
//   https://flaviocopes.com/node-mongodb/
//   https://www.thepolyglotdeveloper.com/2019/01/getting-started-mongodb-docker-container-deployment/
//   https://www.w3schools.com/nodejs/nodejs_mongodb_insert.asp
//
// Google Calendar API:
//   https://developers.google.com/calendar/quickstart/nodejs

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

const express = require ('express')
const morgan = require ('morgan')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
const assert = require('assert');

// Google APIs 
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// Connection URL
// const url = 'mongodb://MyMongoDB:spocknow@docdb-2019-12-27-02-31-01.cluster-cxnnbtcqxpdj.us-west-2.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0';
// Database Name
const dbName = 'MyMongoDB';
 
const url = 'mongodb://localhost:27017/SampleDB';

app.use(morgan('combined'))

app.get("/", (req, res) => {
   console.log("Responding from the route route")
   res.send("Hello from ROOT")
})

app.get("/users/:id", (req, res) => {
  var id = req.params.id;
  console.log('Route: GET /users/:'+ id)
    mongo_users(collection => {
    collection.find({_id: ObjectID(id)}).toArray((err, items) => {
      console.log(items)
      res.send(items)
    })
  })
})

function mongo_users(collectionCallback) {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    collectionCallback(client.db(dbName).collection('users'))
    client.close();
  })
}

app.get("/users", (req, res) => {
  mongo_users(collection => {
    collection.find({}).toArray((err, items) => {
      console.log(items)
      res.send(items)
    })
  })
})

app.get("/users/name/last/:name", (req, res) => {
  var name = req.params.name;
  mongo_users(collection => {
    collection.find({"name.last": name}).toArray((err, items) => {
      console.log(items)
      res.send(items)
    })
  })
})

app.post("/users", (req, res) => {
  var user1 = {fristName: "Colin", lastName: "Frank"}
  console.log('Route: POST /users\n', req.body)

  mongo_users(collection => {
    collection.insertOne(req.body, (err, result) => {
      console.log(result)
      res.sendStatus(200);
    })
  })
})

app.delete("/users/:id", (req, res) => {
  var id = req.params.id;
  console.log('Route: DELETE /users/:'+ id)

  mongo_users(collection => {
    collection.deleteOne({_id: ObjectID(id)}, (err, result) => {
      err ? console.log(err) : console.log(result)
      res.sendStatus(200);
    })
  })
})

app.patch("/users/:id", (req, res) => {
  var id = req.params.id;
  var patchDoc = {'$set': req.body}
  console.log('Route: PATCH /users/:'+ id)

  mongo_users(collection => {
    collection.updateOne({_id: ObjectID(id)}, patchDoc, (err, result) => {
      err ? console.log(err) : console.log(result)
      res.sendStatus(200);
    })
  })
})

app.listen(3003, () => {
  console.log("Listening on port: 3003")
})

//MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, })
//  .then(() => {
//    console.log('DB Connected!')
//    var dbo = db.db(dbName);
//    dbo.collection("customers").insertOne(req.body, function(err, res) {
//      if (err) throw err;
//      console.log("1 document inserted");
//      db.close();
//    });
//  })
//  .catch(err => {
//    console.log('DB Connection Error: '+ err.message);
//  });


// Check out: https://developers.google.com/calendar/quickstart/nodejs
// If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';


app.get("/calendar/appt", (req, res) => {
  gAuth((auth) => {
    const calendar = google.calendar({version: 'v3', auth});
    calendar.events.list({
      calendarId: 'primary', timeMin: (new Date()).toISOString(),
      maxResults: 10, singleEvents: true, orderBy: 'startTime',
    }, (err, gRres) => {
      if (err) { gRres.sendStatus(400); return console.log('The API returned an error: ' + err); }
      const events = gRres.data.items;
      return events.length ? res.send(gRres.data.items) : res.sendStatus(200);
    });
  });
});

// See also: https://developers.google.com/calendar/create-events
app.post("/calendar/appt", (req, res) => {
  var event = {
    'summary': 'Sync Up',
    'location': '114 Goodfellow Dr. Orinda, CA 94563',
    'description': 'http://192.168.1.125:3003/calendar/appt    POST to create',
    'start': {
      'dateTime': '2019-12-27T16:00:00-07:00',
      'timeZone': 'America/Los_Angeles',
    },
    'end': {
      'dateTime': '2019-12-27T17:00:00-07:00',
      'timeZone': 'America/Los_Angeles',
    },
    'recurrence': [
      'RRULE:FREQ=DAILY;COUNT=2'
    ],
    'attendees': [
      {'email': 'Acmclarenfrank@gmail.com'},
      {'email': 'ancfrank@ucsc.com'},
      {'email': 'grhex1@gmail.com'},
    ],
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10},
      ],
    },
  };

  gAuth((auth) => {
    const calendar = google.calendar({version: 'v3', auth});
    calendar.events.insert({
      auth: auth,
      calendarId: 'primary',
      resource: event,
    }, function(err, event) {
      if (err) { gRres.sendStatus(400); return console.log('The API returned an error: ' + err); }
      console.log('Event created: %s', event.data);
      res.send(event.htmlLink)
    });
  });
});

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), listEvents);
});

function gAuth(callback) {
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), callback);
  });
}
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    } else {
      console.log('No upcoming events found.');
    }
  });
}

