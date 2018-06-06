const express = require('express');
const router = express.Router();
const axios = require('axios');

// Look up and return geo details based on IP address
function getGeoIpInfo(ipAddress) {
  GEOIP_API_KEY = 'bfda262377839f3f2a6d7e056d517ff6'
  let geoIpUri = 'http://api.ipstack.com/' + ipAddress + '?access_key=' + GEOIP_API_KEY;
  return axios.get(geoIpUri);
};

// Look up and return restaurant info in the vicinity of location
function getPlaceInfo(lat, lon) {
  const PLACES_API_KEY = 'AIzaSyA7xYjF_kzZgxV9GguXs7pJl0mHv3i2Kdo'
  let placesURI = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=3000&type=restaurant&key=${PLACES_API_KEY}`
  return axios.get(placesURI)
};

// GET home page.
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Node.js Sample Application' });
});

// Get 'Around Me' page
router.get('/around', function (req, res, next) {
  // Get client IP address
  let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let tempIP = '86.175.182.113'

  let city, country, lat, long;

  // Call function to get location details based on IP address
  getGeoIpInfo('86.175.182.113').then((response) => {
    city = response.data.city;
    country = response.data.country_name;
    lat = response.data.latitude;
    long = response.data.longitude;
  }).then((response) => {
    // Call function to get restaurant details based on latitude & longitude
    getPlaceInfo(lat, long).then((response) => {
      let restaurants = []
      for (i in response.data.results) {
        restaurants = JSON.parse(`{"name":"${response.data.results[i].name}"},{"location":"${response.data.results[i].vicinity}"}`);
        console.log(restaurants);
      }
    });

    res.render('around', {
      title: 'Node.js Sample App - Around Me',
      ipAddress: ipAddress,
      city: city,
      country: country,
      restaurants: JSON.stringify(restaurants)
    });


  })
});


module.exports = router;
