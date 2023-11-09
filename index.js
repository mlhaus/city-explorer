// Application dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Application setup
const app = express();
const port = process.env.PORT || 3000;
app.use(cors()); // allows connections to be made with outside sources

// Define routes that users can access
app.get('/', greet);
app.get('/location', locationHandler);
// app.get('/error', (request, response) => {throw new Error("An error occurred")});
app.use('*', fileNotFound);
app.use(errorHandler);

// Handle route requests
function greet(request, response) {
    response.status(200).send("Hello Marc!");
}

function locationHandler(request, response) {
    const search = request.query.search;
    const json = require('./data/location.json');
    const location = new Location(json, search);
    response.status(200).send(location);
}

function fileNotFound(request, response) {
    response.status(404).send("File not found");
}

function errorHandler(error, request, response, next) {
    response.status(500).send(error.message);
}

// Object contructors
function Location(json, search) {
    this.lat = json[0].lat;
    this.lon = json[0].lon;
    this.display_name = json[0].display_name;
    this.search = search;
}

// App listener
app.listen(port, () => console.log(`Listening on port ${port}`));