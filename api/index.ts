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
app.get('/weather', weatherHandler);
app.get('/fox-parker', foxHandler);
app.get('/marc-cow', cowHandler);
app.get('/toney-cow', turkeyHandler);
app.get('/jacob-cow', cowHandlerJL)
app.get('/nathan-cow', nathanHandler);
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
        e: "oO",
        T: " U",
    });
    res.setHeader('content-type', 'text/plain');
    res.status(200).send(str);
}

function foxHandler(req, res) {
    let str = cowsay.say({
        text: "Hello world!",
        f: 'fox'
    });
    res.setHeader('content-type', 'text/plain');
    res.status(200).send(str);
}

function cowHandlerJL(req, res){
    let str = cowsay.say({

        text: "Moo Moo Moo!",
        e: "X X",
        T: " U",
        f: 'fat-cow'
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

function turkeyHandler(req, res) {
    let str = cowsay.say({
        text: 'Turkey Time.',
        T: 'T',
        f: 'turkey'
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
            const location = new Location2(topLocation, search);
            response.status(200).send(topLocation);
        });
    // const location = new Location(json, search);
    // response.status(200).send(location);
}

function nathanHandler(req, res){
    let str = cowsay.say({
        text: "Hello world!",
        e: "-O",
        T: " U",
        f: 'aperture'
    });
    res.setHeader('content-type', 'text/plain');
    res.status(200).send(str);
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

function weatherHandler(request, response) {
    const lat = parseFloat(request.query.lat);
    const lon = parseFloat(request.query.lon);
    console.log(lat, lon);
    superagent.get('https://api.openweathermap.org/data/2.5/weather')
        .query({
            lat: lat,
            lon: lon,
            units: 'imperial',
            appid: process.env.WEATHER_KEY
        })
        .then(responseFromWeather => {
            console.log(responseFromWeather);
            const weather = new Weather(responseFromWeather.body);
            console.log(weather);
            response.status(200).send(weather);

        });
}

function fileNotFound(request, response) {
    response.status(404).send("File not found");
}

function errorHandler(error, request, response, next) {
    response.status(500).send(error.message);
}

// Object contructors
function Location2(json, search) {
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

function Weather(json) {
    console.log(json);
    this.lat = json.coord.lat;
    this.lon = json.coord.lon;
    this.weatherName = json.weather[0].main;
    this.weather = json.weather[0].description;
    this.current_temp= json.main.temp;
    this.feels_like = json.main.feels_like;
    this.temp_min = json.main.temp_min;
    this.temp_max = json.main.temp_max;
    this.pressure = json.main.pressure;
    this.humidity = json.main.humidity;
    this.visibility = json.visibility;
    this.wind_speed= json.wind.speed;
    this.wind_direction= json.wind.deg;
    this.cloud_percentage= json.clouds.all;
    this.sunrise = json.sys.sunrise;
    this.sunset = json.sys.sunset;
    this.timezone = json.timezone;
}
// App listener
app.listen(port, () => console.log(`Listening on port ${port}`));
