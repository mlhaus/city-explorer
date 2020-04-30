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

app.use(errorHandler);
app.use('*', notFoundHandler);

// Route Handlers
function rootHandler(request, response){
  response.send('Response message or action goes here');
}

function locationHandler(request, response){
  let city = "Somewhere"; // to be changed tomorrow
  let locationData = require('./data/geo.json');
  console.log(locationData);
  const locationArray = [];
  locationData.forEach(locationObj => {
    locationArray.push(new Location(city, locationObj));
  });
  console.log(locationArray);
  response.send(locationArray[0]);
}


function errorHandler(error, request, response, next) {
  console.log(error.message);
  response.status(500).send('500 Server Error');
}

function notFoundHandler(request, response) {
  response.status(404).send('Resource not found');
}

// Constructors
function Location(city, locationData) {
  this.search_query = city;
  this.formatted_query = locationData.display_name;
  this.latitude = locationData.lat;
  this.longitude = locationData.lon;
}


// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
