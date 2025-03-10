# WeatherVenue

WeatherVenue is a weather website using Google Maps and Openweathermap data to let people find best places to visit in their entourage; For warmer winter weather vacation or cool summer escapes. 

It is a NodeJs & Express web app with other dependencies (axios, redis, nearby-cities, openweather-apis...).


# A Glimpse of UI


when deployed after research it should be like: 

![UI map](CONTRIBUTING/Capture_map.PNG)

![UI city weather details](CONTRIBUTING/Capture_city_details.PNG)

![UI city pictures](CONTRIBUTING/Capture_city_pictures.PNG)


# Setup

Run Redis server on default port, fill in .env variables:
```ts
// root folder
NODE_ENV=localhost
GOOGLE_MAPS_API_KEY=
OPENWEATHERMAP_API_KEY=
```

```ts
// client
GOOGLE_MAPS_API_KEY=
DEFAULT_LAT=48.86
DEFAULT_LNG=2.34
CENTER_LOCATION=paris
```

both on root folder and inside client folder.

Openweathermap is no longer completely free, If you cannot get a key to run your tests, please ignore `OPENWEATHERMAP_API_KEY` but use the fake variable here:
https://github.com/bacloud22/WeatherVenue/blob/main/libs/consts/fakeOneCallApiResponse.js 

and change `fetchWeather` function as follows

```js
import { fakeApiResponse } from '../consts/fakeOneCallApiResponse.js';

async function fetchWeather (city, language) {
  return new Promise(async (resolve, reject) => {
    // const APIUrlWeather = `https://api.openweathermap.org/data/3.0/onecall?lat=${city.latitude}&lon=${city.longitude}&lang=${language}&exclude=hourly,minutely&units=metric&appid=${OPENWEATHERMAP_API_KEY}`
    // const body0 = await axios.get(APIUrlWeather)
    // const data0 = await body0.data
    // const APIUrlPollution = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${city.latitude}&lon=${city.longitude}&appid=${OPENWEATHERMAP_API_KEY}`
    // const body1 = await axios.get(APIUrlPollution)
    // const data1 = await body1.data
    // resolve({ weather: data0, pollution: data1 })

    resolve({ weather: fakeApiResponse})
  })
}
```

also 

```js
const cities = [nearestCities(query, 10)[0]]// nearestCities(query, 10);
```


# Contribution


Please see open issues for a specific issue, and do not hesitate to open any new issue (like better code, readability, modularity and best practice, performance, better UI or even functionality enhancements...).

If you contribute, please consider that I can merge and publish a new release under one channel or another. It will be 100% free although I can add ads to generate some coffee expenses :)

If you want to maintain the project with me; You can always ask.

Please keep it fair if you want to deploy anywhere; Ask for permission.

Sweet coding !
# run the project 
 1-install redis
...
# License

MIT
