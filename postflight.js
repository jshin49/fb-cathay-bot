var config = require("config");

// Get Facebook page ID to check the sender
const APIAI =
  (process.env.APIAI) ?
  (process.env.APIAI) :
  config.get('apiAiKey');

const weatherApiKey = 
  (process.env.weatherApiKey) ?
  (process.env.weatherApiKey) :
  config.get('weatherApiKey');
  
const googleMapKey = 
  (process.env.googleMapKey) ?
  (process.env.googleMapKey) :
  config.get('googleMapKey');

fetchLocalWeatherData = (location, callback) => {
  var request = require('request');
  request({
    uri: 'http://api.openweathermap.org/data/2.5/weather',
    qs: { 
      q:location, 
      APPID: weatherApiKey
    },
    method: 'GET',
  }, function (error, response, body) {
    var data = JSON.parse(body);
    console.log(data);
    var result = {};
    result.main = data["weather"][0].main;
    result.description = data["weather"][0].description;
    result.temp = Math.floor(data["main"].temp - 273.16);

    console.log(result);
    callback(result);
  });
};

fetchLocalRestaurants = (callback) => {
  var request = require('request');
  // fetch nearby restaurants
  request({
    uri: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
    qs: { 
      key: googleMapKey,
      location: '22.308471,113.9159325', // Demo sequence is HKG Airport, CHange to somewhere you want
      rankby: 'distance',
      language: 'en',
      type: 'restaurant'
    },
    method: 'GET',
  }, 
  (error, response, body) => {
    var data = JSON.parse(body).results;

    // Skip if there's no photo
    // console.log(data);
    for (var i=0; i<data.length; ++i) {
      console.log(data[i].photos);
      if (data[i].photos != undefined) {
        // Detail search
        var result = {};
        result.name = data[i].name;
        result.placeid = data[i].place_id;
        result.photoreference = data[i].photos[0].photo_reference;
        request({
          uri: 'https://maps.googleapis.com/maps/api/place/details/json',
          qs: { 
            placeid: result.placeid,
            key: googleMapKey,
            language: 'en'
          },
          method: 'GET',
        }, 
        (error, response, body) => {
          var data = JSON.parse(body).result;
          console.log(data);          
          result.url = data.url
          // Photo Search
          // console.log('https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+photoreference+'&key='+googleMapKey);
          request({
            uri: 'https://maps.googleapis.com/maps/api/place/photo',
            qs: { 
              maxwidth: '400',
              photoreference: result.photoreference,
              key: googleMapKey
            },
            method: 'GET',
          }, 
          (error, response, body) => {
            console.log(response.request.href);
            result.photo = response.request.href;
            // var data = JSON.parse(body);
            // var result = {};
            // console.log(data);
            callback(result);
          });
        });
        // Break after finding first restaurant with photo
        break;
      }
    }
  });
};

module.exports = {
  fetchLocalWeatherData: fetchLocalWeatherData,
  fetchLocalRestaurants: fetchLocalRestaurants
};

// fetchLocalWeatherData('Hong Kong', (result) => { 
//   console.log(result);
// });

// fetchLocalRestaurants((result) => { 
//   console.log(result);
// });
