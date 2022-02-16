"use strict";

let weatherInfo = [];

// OpenWeatherMaps API KEY (change value to your key!!)
let WEATHER_API_KEY = config.WEATHER_API_KEY;
// Mapbox API KEY (change value to your key!!)
mapboxgl.accessToken = config.MAPBOX_KEY;

// Mapbox API //

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
  enableHighAccuracy: true,
});

function successLocation(position) {
  setupMap([position.coords.longitude, position.coords.latitude]);
}

function errorLocation() {
  setupMap([133.7751, 25.2744]);
}

function setupMap(center) {
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: center,
    zoom: 13,
  });

  const nav = new mapboxgl.NavigationControl();
  map.addControl(nav, "top-left");

  // Mapbox GL Geocoder //

  map.addControl(
    new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
    }).on("result", (selected) => {
      const [longitude, latitude] = selected.result.geometry.coordinates;

      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => weatherInfo.push(data));

      // Set marker options.

      setTimeout(() => {
        const marker = new mapboxgl.Marker({
          color: "#FFFFFF",
          draggable: false,
          color: "#D3D3D3",
          scale: 1.5,
        })
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.Popup().setHTML(`
              <h1>${weatherInfo[0].name}</h1>
              <img src="http://openweathermap.org/img/w/${weatherInfo[0].weather[0].icon}.png"></img>
              <h1>${weatherInfo[0].main.temp}°C</h1>
              <h3>${weatherInfo[0].weather[0].description}</h3>
              `)
          )

          .addTo(map);

        if ((weatherInfo.length = 0)) {
          window.location.reload(true);
        }
      }, 1250);
    })
  );
}
