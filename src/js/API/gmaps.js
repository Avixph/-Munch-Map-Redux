// // importing zomato.js
// // export to index.js
import axios from "axios";

// Create the script tag, set the appropriate attributes
const gMapUrl = process.env.GMAP_URL;
const gMapKey = process.env.GMAP_KEY;
// const gMapApiUrl = process.env.GMAP_URL_KEY;
let script = document.createElement("script");
// script.src = `${gMapApiUrl}`;
script.src = `${gMapUrl}js?key=${gMapKey}&callback=initMap`;
// ("https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap");
script.defer = true;

navigator.geolocation.getCurrentPosition(giveLocation, error);
if (navigator.geolocation) {
  console.log("Geolocation is supported!");
} else {
  console.log("Geolocation is not supported for this Browser/OS version yet.");
}

function giveLocation(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  console.log(latitude, longitude);

  // Attach your callback function to the `window` object
  window.initMap = () => {
    // JS API is loaded and available
    const userLocation = { lat: latitude, lng: longitude };
    // const icon = "../src/images/logos/map-pin.png";

    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 14,
      center: userLocation,
    });
    new google.maps.Marker({
      position: userLocation,
      map,
      title: "munch map!",
    });

    // const iconBase =
    //   "../src/images/logos/";
    // const icons = {
    //   info: {
    //     icon: "../src/images/logos/map-pin.png",
    //   },
    // };
    // const restaurants = [
    //   {
    //     position: new google.maps.LatLng(40.8489722222, -73.8622888889),
    //     type: "info",
    //   },
    //   {
    //     position: new google.maps.LatLng(40.8321416667, -73.8510277778),
    //     type: "info",
    //   },
    //   {
    //     position: new google.maps.LatLng(40.8361027778, -73.8549194444),
    //     type: "info",
    //   },
    //   {
    //     position: new google.maps.LatLng(40.8322027778, -73.8649583333),
    //     type: "info",
    //   },
    //   {
    //     position: new google.maps.LatLng(40.8251611111, -73.8702777778),
    //     type: "info",
    //   },
    // ];

    const image =
      "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
    const flag = { lat: 40.8489722222, lng: -73.8622888889 };
    const marker = new google.maps.Marker({
      position: flag,
      map,
      icon: image,
    });
  };

  // Append the 'script' element to 'head'
  document.head.appendChild(script);
  initMap();
}
function error(message) {
  console.log("user declined location access");
}
