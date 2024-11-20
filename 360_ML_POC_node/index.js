
const express = require('express')
const https = require('https');
const fs = require('fs');
const app = express()

const key = fs.readFileSync('key.pem', 'utf8');
const cert = fs.readFileSync('cert.pem', 'utf8');
const credentials = { key, cert };

const http = require('http');
//const https = require('https');
const server = http.createServer(app);

//const { Server } = require("socket.io");
//const io = new Server(server);

var bodyParser = require('body-parser')
var cors = require('cors')


app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


require('./routes/utilities.js')(app);

const httpsServer = https.createServer(credentials, app);
//START OUR SERVER
httpsServer.listen(3000, '192.168.0.121', () => {
    console.log('Server listening on https://localhost:3000');
});