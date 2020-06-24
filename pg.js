//express and webserver setup
const express = require('express');
const app = express();
//Morgan logging setup
const morgan = require('morgan');
app.use(morgan('short'));//logs program requests

/*What do these two do?
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
*/

//Webserver test
app.get("/",(req,res) => {
    console.log("Root response");
    res.send("Hello World!");//res.send send response to server
})

app.get("/users", (req, res) => {
    //res.send("Nodemon autonomously updates per change!");

    const user1 = {firstName: "Micheal", lastName: "Jackson"}
    const user2 = {firstName: "Michell", lastName: "Obama"}
    res.json([user1, user2]) 
    
})

//connect node.js to postgres
//database setup
const {Client} = require('pg');
const client = new Client({
    user: "postgres",
    password: "DB2020",
    host: "JSnack58",
    port: 5432,
    database: "postgres"
})

client.connect()//connect to database
//succeful connection
.then(() => console.log("Connection successful"))
.catch(e => console.log("error"))//catch errors
.finally(() => client.end())//ends connection


//execute listening on port 3000
app.listen(3000,()=>{
    console.log("Server listening to 3000");
})


//create user, cart, and book
//delete user, cart, and book
//get user, cart, and book information
//modify user, cart, and book information
