import axios from "axios";
import { restaurantNearby } from '../nearbyResults.js';
import { restaurantSearch } from '../searchResults.js';

if (navigator.geolocation) {
  console.log("Geolocation is supported!");
} else {
  console.log("Geolocation is not supported for this Browser/OS version yet.");
}

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

function searchRemove() {
  const searchBtn = document.querySelector(".search");
  if (document.querySelector(".card-section").scrollTop > 120) {
    searchBtn.classList.add("blurred");
  } else if (document.querySelector(".card-section").scrollTop === 0) {
    searchBtn.classList.remove("blurred");
  }
  searchBtn.addEventListener('click', () => {
    searchBtn.classList.remove('blurred');
  });
}

// IF USER ALLOWS LOCATION
function giveLocation(position) {
  // GET LAT AND LONG
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

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
      const search = await axios.get(`https://developers.zomato.com/api/v2.1/search?q=${searchInput.value}&count=20&lat=${latitude}&lon=${longitude}&sort=rating`, config);

      console.log(search);

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

      const allRestaurants = {};
      let searchResults = {};

      // CHANGE NUMBER TO DOLLAR SIGNS FOR PRICE RANGE

      for (let item of geocode.data.nearby_restaurants) {
        if (typeof item.restaurant.price_range === "number") {
          let numOfTimes = item.restaurant.price_range;
          item.restaurant.price_range = "";
          for (let i = 0; i < numOfTimes; i++) {
            item.restaurant.price_range += "$";
          }
        }

        // OBJECT THAT CONTAINS ALL OF OUR DATA
        allRestaurants[item.restaurant.name] = {
          ResCoordinates: {
            lat: Number(item.restaurant.location.latitude),
            lng: Number(item.restaurant.location.longitude),
          },

          RestaurantName: item.restaurant.name,
          Score: `${item.restaurant.user_rating.aggregate_rating}`,
          ReviewText: `${item.restaurant.user_rating.rating_text}`,
          Cuisine: item.restaurant.cuisines,
          AverageCost: `${item.restaurant.average_cost_for_two}`,
          PriceRange: `${item.restaurant.price_range}`,
          FeaturedImg: item.restaurant.featured_image,
          Location: `${item.restaurant.location.address}`,
        };
      }


      for (let item of search.data.restaurants) {
        if (typeof item.restaurant.price_range === "number") {
          let numOfTimes = item.restaurant.price_range;
          item.restaurant.price_range = "";
          for (let i = 0; i < numOfTimes; i++) {
            item.restaurant.price_range += "$";
          }
        }


        // OBJECT THAT CONTAINS ALL OF OUR DATA
        searchResults[item.restaurant.name] = {
          ResCoordinates: {
            lat: Number(item.restaurant.location.latitude),
            lng: Number(item.restaurant.location.longitude),
          },

          RestaurantName: item.restaurant.name,
          Score: `${item.restaurant.user_rating.aggregate_rating}`,
          ReviewText: `${item.restaurant.user_rating.rating_text}`,
          Cuisine: item.restaurant.cuisines,
          AverageCost: `${item.restaurant.average_cost_for_two}`,
          PriceRange: `${item.restaurant.price_range}`,
          FeaturedImg: item.restaurant.featured_image,
          Location: `${item.restaurant.location.address}`,
        };
      }

      let restaurantValues = Object.values(allRestaurants);
      let searchRestaurantValues = Object.values(searchResults);

      console.log(searchRestaurantValues);

      // FUNCTION THAT RETURNS A NEW CARD WITH RESTAURANT INFO
      let cardSection = document.querySelector(".card-section");

      // APPENDING NEW RESTAURANT CARDS TO OUR DOM
      function populateNearbyRestaurants() {
        const cardContainer = document.querySelectorAll('.card-container');
        for (let div of cardContainer) {
          div.remove();
        }
        for (let item of restaurantValues) {
          let resDiv = document.createElement("div");
          resDiv.classList.add("d-flex", "justify-content-center");
          resDiv.innerHTML = restaurantNearby(item);
          cardSection.append(resDiv);
        }
      }

      populateNearbyRestaurants();

      function populateRestaurant() {
        for (let item of searchRestaurantValues) {
          let resDiv = document.createElement("div");
          resDiv.classList.add("d-flex", "justify-content-center");
          resDiv.innerHTML = restaurantSearch(item);
          cardSection.append(resDiv);
        }
      }

      //  ADD SEARCH RESULT ITEMS HERE
      const searchForm = document.querySelector('.search');

      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        searchInput.addEventListener('keyup', (e) => {

          const cardContainer = document.querySelectorAll('.card-container');
          for (let div of cardContainer) {
            div.remove();
          }

          if (e.keyCode === 13) {
            const city = `${geocode.data.location.city_name}`;
            let area = document.querySelector(".subzone");
            area.innerText = city;

            populateRestaurant();
          }
        });
      });



      // DISPLAYING GMAPS JS API
      // const script = document.createElement("script");
      // script.src = `${gMapUrl}js?key=${gMapKey}&callback=initMap`;
      // script.defer = true;
      // console.log(script);

      // window.initMap = () => {
      //   // GMAPS JS API IS LOADED AND AVAILABLE
      //   const userLocation = { lat: latitude, lng: longitude };
      //   const image =
      //     "https://raw.githubusercontent.com/Avixph/-Munch-Map-Redux/developer/src/images/logos/flag.png";
      //   const map = new google.maps.Map(document.getElementById("map"), {
      //     zoom: 14,
      //     center: userLocation,
      //   });
      //   new google.maps.Marker({
      //     position: userLocation,
      //     map,
      //     title: "munch map!",
      //   });

      //   for (let item of restaurantValues) {
      //     const marker = new google.maps.Marker({
      //       position: item.ResCoordinates,
      //       map,
      //       icon: image,
      //     });
      //   }
      // };
      // // Append the 'script' element to 'head'
      // document.head.appendChild(script);
      // initMap();

    } catch (e) {
      console.log("error", e);
    }
  }
  getData();
}
function error(message) {
  console.log("user declined location access");
}
