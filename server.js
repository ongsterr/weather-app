// load npm modules
const bodyParser = require('body-parser');
const request = require('request');
const express = require('express');
const app = express();
require('dotenv').config();

const port = 3000
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index', { weather: null, error: null })
    req.body.city = ''
    console.log(req.body)
})

app.post('/', (req, res) => {
    console.log(req.body)

    const cityName = req.body.city
    const countryCode = 'AU';
    const apiKey = process.env.WEATHER_KEY
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&units=metric&appid=${apiKey}`;

    request(url, (err, response, body) => {
        if (err) {
            res.render('index', { weather: null, error: 'Error! Please try again later.' }) // res.render has an optional second argument — an object where we can specify properties to be handled by our view
        }

        let weather = JSON.parse(body)
        if (weather.main == undefined) {
            res.render('index', {weather: null, error: 'Error! Please try again later.'})
        }

        const message = `It's ${weather.main.temp} degree celcius in ${weather.name}!`
        res.render('index', {weather: message, error: null})
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}.`)
})