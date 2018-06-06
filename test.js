const axios = require('axios');


function getGeoIpInfo(ipAddress) {
    var city = '???';;
    var country = 'country';
    var lat = 'lat';
    var long = 'long';

    const GEOIP_API_KEY = 'bfda262377839f3f2a6d7e056d517ff6'
    let geoIpURI = 'http://api.ipstack.com/' + ipAddress + '?access_key=' + GEOIP_API_KEY;
    return axios.get(geoIpURI);
    console.log
}

function getPlaceInfo(lat, lon) {
    const PLACES_API_KEY = 'AIzaSyA7xYjF_kzZgxV9GguXs7pJl0mHv3i2Kdo'
    let placesURI = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=3000&type=restaurant&key=${PLACES_API_KEY}`
    return axios.get(placesURI)
};

// let city, country, lat, long;
// let restaurants

getGeoIpInfo('86.175.182.113').then((response) => {
    city = response.data.city;
    country = response.data.country_name;
    lat = response.data.latitude;
    long = response.data.longitude;
}).then((response) => {
    getPlaceInfo(lat, long).then((response) => {
        for (i in response.data.results) {
            restaurants = JSON.parse(`{"${response.data.results[i].name}":"${response.data.results[i].vicinity}"}`);
            console.log(restaurants);
        }
    });
});




