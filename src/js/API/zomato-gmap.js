import axios from "axios";

import { getResData } from "../getResData.js";
import { searchRemove } from "../scrollSearch.js";
import { showSearchMarkers } from "./gmaps.js";
import { filterSearch } from '../filterSearch.js';
import { appendRestaurants } from '../appendRestaurants.js';
import { config, ZOMATO_URL, gMapUrl, gMapKey } from '../config.js';

// GEOLOCATION CALL
navigator.geolocation.getCurrentPosition(giveLocation, error);

navigator.permissions.query({ name: 'geolocation' })
  .then(function (permissionStatus) {
    console.log('geolocation permission state is ', permissionStatus.state);

    permissionStatus.onchange = function () {
      console.log('geolocation permission state has changed to ', this.state);
      location.reload();
    };
  });

// IF USER ALLOWS LOCATION
function giveLocation(position) {
  // GET LAT AND LONG
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const userLocation = { lat: latitude, lng: longitude };

  // ASYNC FUNCTION START FOR API CALLS
  async function getData() {
    try {
      // GETTING GEOCODE DATA FOR ZOMATO
      const geocode = await axios.get(
        `${ZOMATO_URL}geocode?lat=${latitude}&lon=${longitude}`,
        config
      );

      // DISPLAY WHAT AREA THE USER IS IN
      const subzone = `${geocode.data.popularity.subzone}`;
      let area = document.querySelector(".subzone");
      area.innerText = subzone;

      // REFRESH PAGE ON GPS CLICK
      const refreshNearby = document.querySelector('.refresh-nearby');
      refreshNearby.addEventListener('click', () => location.reload());

      // ALL DIV ID'S FOR CUISINE ITEMS
      const allCuisineItems = document.querySelectorAll(
        "#cuisine-1, #cuisine-2, #cuisine-3, #cuisine-4, #cuisine-5"
      );

      // THE TOP CUISINES ARRAY
      let topCuisines = geocode.data.popularity.top_cuisines.map((cuisine) => {
        return cuisine;
      });

      // LIST ALL TOP CUISINES FOR DOM
      for (let i = 0; i < allCuisineItems.length; i++) {
        allCuisineItems[i].innerText = topCuisines[i];
      }

      let cardSection = document.querySelector(".card-section");

      appendRestaurants(geocode.data.nearby_restaurants, cardSection);

      // SEARCH ELEMENTS FROM DOM
      const searchInput = document.querySelector(".search__bar");
      const searchForm = document.querySelector(".search");

      // SEARCH SCROLL
      const cardsec = document.querySelector(".card-section");

      cardsec.onscroll = function () {
        searchRemove();
      };

      // AFTER USER CLICKS ENTER ON SEARCH
      searchForm.addEventListener("submit", (e) => {

        e.preventDefault();
        searchInput.addEventListener("keyup", async (e) => {
          const cardContainer = document.querySelectorAll(".card-container");
          for (let div of cardContainer) {
            div.remove();
          }

          if (e.keyCode === 13) {
            const search = await axios.get(
              `${ZOMATO_URL}search?q=${searchInput.value}&count=50&lat=${latitude}&lon=${longitude}`,
              config
            );

            if (search.data.restaurants.length === 0) {
              location.replace("error.html");
            }
            else {

              const filterButton = document.querySelector('.filter');
              filterButton.classList.remove('d-none');

              filterSearch(searchInput.value, latitude, longitude, cardSection);

              showSearchMarkers(getResData(search.data.restaurants), userLocation);

              appendRestaurants(search.data.restaurants, cardSection);

              const city = `${geocode.data.location.city_name}`;
              let area = document.querySelector(".subzone");
              area.innerText = city;

              searchInput.value = "";
            }

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
          "https://raw.githubusercontent.com/Avixph/-Munch-Map-Redux/c47b818f43e4ad6b7a0dff30050b72002180fbf0/src/images/icons/MM-Icon-sm.svg";
        const map = new google.maps.Map(document.getElementById("map"), {
          zoom: 14,
          center: userLocation,
        });
        new google.maps.Marker({
          position: userLocation,
          map,
          title: "munch map!",
        });

        for (let item of await getResData(geocode.data.nearby_restaurants)) {
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
  const proceed = document.querySelector('#proceed');
  proceed.setAttribute('href', '#');
  alert('Please give location access first!');
}