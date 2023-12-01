// Application dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const cowsay = require("cowsay");

// Application setup
const app = express();
const port = process.env.PORT || 3000;
app.use(cors()); // allows connections to be made with outside sources


// Define routes that users can access
app.get('/', greet);
app.get('/location', locationHandler);
app.get('/yelp', restaurantHandler);
app.get('/marc-cow', cowHandler);
app.get('/josh-cow', joshHandler)
app.get('/jared-tux', tuxHandler);
// TODO: Create a path for /weather
// app.get('/error', (request, response) => {throw new Error("An error occurred")});
app.use('*', fileNotFound);
app.use(errorHandler);

// Handle route requests
function greet(request, response) {
    response.status(200).send("Welcome!");
}
function joshHandler(req, res) {
    let str = cowsay.say({
        text: "Oh hi Marc!",
        T: " U",
    });
    res.setHeader('content-type', 'text/plain');
    res.status(200).send(str);
}


function cowHandler(req, res) {
    let str = cowsay.say({
        text: "Hello world!",
        e: "-O",
        T: " U",
    });
    res.setHeader('content-type', 'text/plain');
    res.status(200).send(str);
}

function tuxHandler(req, res) {
    let str = cowsay.say({
        text: 'Penguins are cool.',
        f: 'tux'
    });
    res.setHeader('content-type', 'text/plain');
    res.status(200).send(str);
}

function locationHandler(request, response) {
    // const json = require('./data/location.json');
    const search = request.query.search;
    superagent.get("https://us1.locationiq.com/v1/search.php")
        .query({
            key: process.env.LOCATIONIQ_KEY,
            q: search,
            format: 'json'
        })
        .then(responseFromLocationIQ => {
            const topLocation = responseFromLocationIQ._body[0];
            const location = new Location(topLocation, search);
            response.status(200).send(location);
        });
    // const location = new Location(json, search);
    // response.status(200).send(location);
}

function restaurantHandler(request, response) {
    const lat = parseFloat(request.query.lat);
    const lon = parseFloat(request.query.lon);
    superagent.get('https://api.yelp.com/v3/businesses/search')
        .query({
            latitude: lat,
            longitude: lon,
            limit: 4
        })
        .set("Authorization", `Bearer ${process.env.YELP_KEY}`)
        .then(responseFromYelp => {
            const dataArr = responseFromYelp.body.businesses;
            const businessArr = [];
            dataArr.forEach((business) => {
                businessArr.push(new Business(business));
            });
            response.status(200).send(businessArr);
        });
}

// TODO: Create a weatherHandler

function fileNotFound(request, response) {
    response.status(404).send("File not found");
}

function errorHandler(error, request, response, next) {
    response.status(500).send(error.message);
}

// Object contructors
function Location(json, search) {
    this.lat = json.lat;
    this.lon = json.lon;
    this.display_name = json.display_name;
    this.search = search;
}

function Business(json) {
    this.name = json.name;
    this.rating = json.rating;
    this.image_url = json.image_url;
    this.price = json.price;
    this.url = json.url;
    this.phone = json.display_phone;
    this.categories = [];
    json.categories.forEach(category => {
        this.categories.push(category.title);
    });
    this.address = json.location.address1;
    this.address += json.location.address2 !== null ? "\n" + json.location.address2 : '';
    this.city = json.location.city;
    this.state = json.location.state;
    this.zip = json.location.zip_code;
}

// TODO: Create a Weather class
// Display description, current_temp, feels_like, min_temp, max_temp, wind_speed, wind_direction, cloud_percentage

// App listener
app.listen(port, () => console.log(`Listening on port ${port}`));