import axios from "axios";
import { populateRestaurants } from '../populateRestaurants.js';
import { getResData } from '../getResData.js';
import { searchRemove } from '../scrollSearch.js';
import { showSearchMarkers } from './gmaps.js';

let ZOMATO_KEY = process.env.ZOMATO_KEY;
let ZOMATO_URL = process.env.ZOMATO_URL;
let gMapUrl = process.env.GMAP_URL;
let gMapKey = process.env.GMAP_KEY;

// GEOLOCATION CALL
navigator.geolocation.getCurrentPosition(giveLocation, error);

// SEARCH
const cardsec = document.querySelector('.card-section');

cardsec.onscroll = function () {
  searchRemove();
};

// IF USER ALLOWS LOCATION
function giveLocation(position) {
  // GET LAT AND LONG
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const userLocation = { lat: latitude, lng: longitude };

  // ASYNC FUNCTION START FOR API CALLS
  async function getData() {
    try {

      const config = {
        headers: {
          Accept: "application/json",
          "user-key": `${ZOMATO_KEY}`,
        },
      };

      // GETTING GEOCODE DATA FOR ZOMATO
      const geocode = await axios.get(
        `${ZOMATO_URL}geocode?lat=${latitude}&lon=${longitude}`,
        config
      );

      // GETTING SEARCH RESULTS FOR ZOMATO - SORTED BY RATING
      const searchInput = document.querySelector('.search__bar');

      // DISPLAY WHAT AREA THE USER IS IN
      const subzone = `${geocode.data.popularity.subzone}`;
      let area = document.querySelector(".subzone");
      area.innerText = subzone;

      // ALL DIV ID'S FOR CUISINE ITEMS
      const allCuisineItems = document.querySelectorAll(
        "#cuisine-1, #cuisine-2, #cuisine-3, #cuisine-4, #cuisine-5"
      );

      // THE TOP CUISINES ARRAY
      let topCuisines = geocode.data.popularity.top_cuisines.map(cuisine => {
        return cuisine;
      });

      // LIST ALL TOP CUISINES FOR DOM
      for (let i = 0; i < allCuisineItems.length; i++) {
        allCuisineItems[i].innerText = topCuisines[i];
      }

      let cardSection = document.querySelector(".card-section");

      // APPENDING NEW RESTAURANT CARDS TO OUR DOM
      function appendRestaurants() {
        const cardContainer = document.querySelectorAll('.card-container');
        for (let div of cardContainer) {
          div.remove();
        }
        for (let item of getResData(geocode.data.nearby_restaurants)) {
          let resDiv = document.createElement("div");
          resDiv.classList.add("d-flex", "justify-content-center");
          resDiv.innerHTML = populateRestaurants(item);
          cardSection.append(resDiv);
        }
      }

      appendRestaurants();

      let resGeoCodeArr = getResData(geocode.data.nearby_restaurants);

      //  ADD SEARCH RESULT ITEMS HERE
      const searchForm = document.querySelector('.search');

      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        searchInput.addEventListener('keyup', async (e) => {

          const cardContainer = document.querySelectorAll('.card-container');
          for (let div of cardContainer) {
            div.remove();
          }

          if (e.keyCode === 13) {
            const search = await axios.get(`https://developers.zomato.com/api/v2.1/search?q=${searchInput.value}&count=20&lat=${latitude}&lon=${longitude}&sort=rating`, config);

            showSearchMarkers(getResData(search.data.restaurants), userLocation);

            function appendRestaurants() {
              const cardContainer = document.querySelectorAll('.card-container');
              for (let div of cardContainer) {
                div.remove();
              }
              for (let item of getResData(search.data.restaurants)) {
                let resDiv = document.createElement("div");
                resDiv.classList.add("d-flex", "justify-content-center");
                resDiv.innerHTML = populateRestaurants(item);
                cardSection.append(resDiv);
              }
            }

            appendRestaurants();

            const city = `${geocode.data.location.city_name}`;
            let area = document.querySelector(".subzone");
            area.innerText = city;
          }
        });
      });


      // DISPLAYING GMAPS JS API
      const script = document.createElement("script");
      script.src = `${gMapUrl}js?key=${gMapKey}&callback=initMap`;
      script.defer = true;

      window.initMap = async () => {
        // GMAPS JS API IS LOADED AND AVAILABLE
        const image =
          "https://raw.githubusercontent.com/Avixph/-Munch-Map-Redux/developer/src/images/logos/flag.png";
        const map = new google.maps.Map(document.getElementById("map"), {
          zoom: 14,
          center: userLocation,
        });
        new google.maps.Marker({
          position: userLocation,
          map,
          title: "munch map!",
        });

        for (let item of await resGeoCodeArr) {
          const marker = new google.maps.Marker({
            position: item.ResCoordinates,
            map,
            icon: image,
          });
        }
      };

      // Append the 'script' element to 'head'
      document.head.appendChild(script);

    } catch (e) {
      console.log("error", e);
    }
  }
  getData();
}
function error(message) {
  console.log("user declined location access");
}
