const express = require('express');
const router = express.Router();
const request = require('request');

const WEATHER_API_KEY = '6c83cfabefbbedbfed6c3481817dd372'
const GEOIP_API_KEY = 'bfda262377839f3f2a6d7e056d517ff6'
const PLACES_API_KEY = 'AIzaSyA7xYjF_kzZgxV9GguXs7pJl0mHv3i2Kdo'

/////////////////////////////////////////////////
//// GET home page.
/////////////////////////////////////////////////
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Node.js Sample Application' });
});

/////////////////////////////////////////////////
//// Get 'Around Me' page
/////////////////////////////////////////////////
router.get('/around', function (req, res, next) {
  // Get client IP address
  let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  let city, country, lat, long;

  // Lookup up location based on IP address
  let geoIpUri = 'http://api.ipstack.com/' + ipAddress + '?access_key=' + GEOIP_API_KEY;
  request(geoIpUri, { json: true }, (apierr, apires, geoApiBody) => {
    if (apierr) { return console.log(apierr); }
    country = geoApiBody.country_name;
    city = geoApiBody.city;
    lat = geoApiBody.latitude;
    long = geoApiBody.longitude;

    // Lookup up restaurant info based on location
    let restaurantUri = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=3000&type=restaurant&key=${PLACES_API_KEY}`
    let restaurantsList = []

    request(restaurantUri, { json: true }, (apierr, apires, restaurantApiBody) => {
      if (apierr) { return console.log(apierr); }
      let restaurants = restaurantApiBody.results;
      for (i in restaurants) {
        restaurantsList.push(JSON.parse(`{"name":"${restaurants[i].name}","location":"${restaurants[i].vicinity}"}`)); // Add restaurant name and location info to array
      };

      // Lookup up shopping mall info based on location
      let shoppingMallUri = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=10000&type=shopping_mall&key=${PLACES_API_KEY}`
      let shoppingMallList = []

      request(shoppingMallUri, { json: true }, (apierr, apires, shoppingApiBody) => {
        if (apierr) { return console.log(apierr); }
        let shoppingMalls = shoppingApiBody.results;
        for (i in shoppingMalls) {
          shoppingMallList.push(JSON.parse(`{"name":"${shoppingMalls[i].name}","location":"${shoppingMalls[i].vicinity}"}`)); // Add shopping mall name and location info to array
        };
        res.render('around', {
          title: 'Node.js Sample App - Around Me',
          ipAddress: ipAddress,
          city: city,
          country: country,
          restaurants: restaurantsList,
          shoppingMalls: shoppingMallList
        })

      })
    });
  });
})

/////////////////////////////////////////////////
//// Get 'Weather' page
/////////////////////////////////////////////////
router.get('/weather', function (req, res, next) {
  let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // let tempIP = '86.175.182.113'

  let city, country, lat, long;

  const GEOIP_API_KEY = 'bfda262377839f3f2a6d7e056d517ff6'

  // Lookup up location based on IP address
  let geoIpUri = 'http://api.ipstack.com/' + ipAddress + '?access_key=' + GEOIP_API_KEY;
  request(geoIpUri, { json: true }, (apierr, apires, geoApiBody) => {
    if (apierr) { return console.log(apierr); }
    country = geoApiBody.country_name;
    city = geoApiBody.city;
    lat = geoApiBody.latitude;
    long = geoApiBody.longitude;

    // Lookup up weather info based on location
    request(`https://api.darksky.net/forecast/${WEATHER_API_KEY}/${lat},${long}?units=uk2`, { json: true }, (apierr, apires, weather) => {
      if (apierr) { return console.log(apierr); }
      if (weather.currently) {
        res.render('weather', {
          title: 'Node.js Sample App - Around Me',
          ipAddress: ipAddress,
          country: country,
          city: city,
          summary: weather.currently.summary,
          temp: weather.currently.temperature,
          dailySummary: weather.daily.summary

        });
      } else {
        return res.status(500).end('Error fetching weather: ' + apierr + ' - ' + apires);
      }
    });
  });
});

module.exports = router;
