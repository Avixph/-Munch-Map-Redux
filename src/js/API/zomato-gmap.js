import axios from "axios";

if (navigator.geolocation) {
  console.log("Geolocation is supported!");
} else {
  console.log("Geolocation is not supported for this Browser/OS version yet.");
}

let ZOMATO_KEY = process.env.ZOMATO_KEY;
let ZOMATO_URL = process.env.ZOMATO_URL;

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
      const search = await axios.get(`https://developers.zomato.com/api/v2.1/search?q=indian&count=20&lat=40.8383&lon=-73.8566&sort=rating`, config);
      console.log(search);

      console.log(geocode);

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

      let restaurantValues = Object.values(allRestaurants);

      // FUNCTION THAT RETURNS A NEW CARD WITH RESTAURANT INFO
      let restaurant = ({
        RestaurantName,
        Score,
        ReviewText,
        Cuisine,
        AverageCost,
        PriceRange,
        FeaturedImg,
        Location,
      }) => {
        return `
        <div class="col-lg-10 col-md-12 col-sm-12 card-container">
            <h1 class="text-center res-name"><span class="info">${RestaurantName}</span></h1>
            <div class="d-flex align-items-center row">
                <div class="col-lg-6 col-md-12 col-sm-12">
                    <div class="restaurant-container">
                        <div class="col-12 card-info">
                            <ul>
                                <li>Cuisine: <span class="info">${Cuisine}</span></li>
                                <li>Price range: <span class="info money">${PriceRange}</span></li>
                                <li>Average cost for two: <span class="info">${Number(AverageCost) ? `$${AverageCost}` : `N/A`}</span></li>
                                <li>Location: <span class="info">${Location}</span></li>
                                <li>Score: <span class="info">${Number(Score) ? `${Score} / 5.0` : `N/A`}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 col-md-12 col-sm-12">
                    <div class="d-flex align-items-center food-container">
                        <div class="col-12 text-center food-pic">
                  
                            <img src="${FeaturedImg ? FeaturedImg : "https://cdn.discordapp.com/attachments/661356197768855554/785260477022208030/404-img.png"}" alt="" /> 
                            <h3><span class="info review">"${ReviewText}"</span></h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
      };

      let cardSection = document.querySelector(".card-section");


      // APPENDING NEW RESTAURANT CARDS TO OUR DOM
      for (let item of restaurantValues) {
        let resDiv = document.createElement("div");
        resDiv.classList.add("d-flex", "justify-content-center");
        resDiv.innerHTML = restaurant(item);
        cardSection.append(resDiv);
      }
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
