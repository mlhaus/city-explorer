'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');

// Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

// Route Definitions
app.get('/', rootHandler);
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/trails', trailsHandler);
app.get('/movies', moviesHandler);
app.get('/yelp', yelpHandler);

app.use(errorHandler);
app.use('*', notFoundHandler);

// Route Handlers
function rootHandler(request, response){
  response.send('Response message or action goes here');
}

function locationHandler(request, response){
  response.send('Response message or action goes here');
}

function weatherHandler(request, response){
  response.send('Response message or action goes here');
}

function trailsHandler(request, response){
  response.send('Response message or action goes here');
}

function moviesHandler(request, response){
  response.send('Response message or action goes here');
}

function yelpHandler(request, response){
  response.send('Response message or action goes here');
}

function errorHandler(error, request, response, next) {
  console.log(error.message);
  response.status(500).send('500 Server Error');
}

function notFoundHandler(request, response) {
  response.status(404).send('Resource not found');
}

// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
