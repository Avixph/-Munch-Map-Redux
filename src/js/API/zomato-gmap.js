import axios from "axios";

if (navigator.geolocation) {
  console.log("Geolocation is supported!");
} else {
  console.log("Geolocation is not supported for this Browser/OS version yet.");
}

let ZOMATO_KEY = process.env.ZOMATO_KEY;
let ZOMATO_URL = process.env.ZOMATO_URL;
let gMapUrl = process.env.GMAP_URL;
let gMapKey = process.env.GMAP_KEY;

navigator.geolocation.getCurrentPosition(giveLocation, error);

function giveLocation(position) {

  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  console.log(latitude, longitude);
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

      console.log(geocode);

      const allRestaurants = {};
      const topCuisines = [];

      // const subzone = `${geocode.data.popularity.subzone}, ${geocode.data.popularity.city}`;

      // console.log("Subzone: \n", subzone);

      const allCuisineItems = document.querySelectorAll('#cuisine-1, #cuisine-2, #cuisine-3, #cuisine-4, #cuisine-5');

      for (let item of geocode.data.popularity.top_cuisines) {
        topCuisines.push(item);
      }

      for (let i = 0; i < allCuisineItems.length; i++) {
        allCuisineItems[i].innerText = topCuisines[i];
      }

      for (let item of geocode.data.nearby_restaurants) {
        //   if (item.restaurant.user_rating.aggregate_rating === 0) {
        //     item.restaurant.user_rating.aggregate_rating = "No rating available";
        //   }

        allRestaurants[item.restaurant.name] = {
          ResCoordinates: {
            lat: Number(item.restaurant.location.latitude),
            lng: Number(item.restaurant.location.longitude),
          },

          RestaurantName: item.restaurant.name,
          Score: `${item.restaurant.user_rating.aggregate_rating}`,
          ReviewText: `${item.restaurant.user_rating.rating_text}`,
          Cuisine: item.restaurant.cuisines,
          AverageCost: `$${item.restaurant.average_cost_for_two}`,
          PriceRange: `${item.restaurant.price_range}/5`,
          FeaturedImg: item.restaurant.featured_image,
          Location: `${item.restaurant.location.address}`,
        };
      }

      let restaurantValues = Object.values(allRestaurants);
      // console.log("Example restaurant:\n", restaurantValues[1]);

      let cardSection = document.querySelector('.card-section');

      console.log(`ASDASDIASDJAS`, restaurantValues);

      let restaurant = ({ RestaurantName, Score, ReviewText, Cuisine, AverageCost, PriceRange, FeaturedImg, Location }) => {
        return `
        <div class="col-lg-9 col-md-12 col-sm-12 card-container">
            <h1 class="text-center res-name"><span class="info">${RestaurantName}</span></h1>
            <div class="d-flex align-items-center row">
                <div class="col-lg-6 col-md-12 col-sm-12">
                    <div class="restaurant-container">
                        <div class="col-12 card-info">
                            <ul>
                                <li>Cuisine: <span class="info">${Cuisine}</span></li>
                                <li>Price range: <span class="info">${PriceRange}</span></li>
                                <li>Average cost for two: <span class="info">${AverageCost}</span></li>
                                <li>Location: <span class="info">${Location}</span></li>
                                <li>Score: <span class="info">${Number(Score) ? `${Score} / 5.0` : `Not rated`}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 col-md-12 col-sm-12">
                    <div class="d-flex align-items-center food-container">
                        <div class="col-12 text-center food-pic">
                  
                            <img src="${FeaturedImg ? FeaturedImg : 'https://thebattengroup.com/wp-content/uploads/2017/03/no-image-icon.png'}" alt="" /> 
                            <h3>"<span class="info">${ReviewText}"</span></h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
      };

      // C:\Users\bxsha\Documents\Phase1-Redux\-Munch-Map-Redux\src\images\No-Image.png

      for (let item of restaurantValues) {
        let resDiv = document.createElement('div');
        resDiv.classList.add('d-flex', 'justify-content-center');
        resDiv.innerHTML = restaurant(item);
        cardSection.append(resDiv);
      }

      // DISPLAYING GMAPS JS API
      const script = document.createElement("script");
      script.src = `${gMapUrl}js?key=${gMapKey}&callback=initMap`;
      script.defer = true;
      console.log(script);

      window.initMap = () => {
        // GMAPS JS API IS LOADED AND AVAILABLE
        const userLocation = { lat: latitude, lng: longitude };
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

        for (let item of restaurantValues) {
          const marker = new google.maps.Marker({
            position: item.ResCoordinates,
            map,
            icon: image,
          });
        }
      };
      // Append the 'script' element to 'head'
      document.head.appendChild(script);
      initMap();
    } catch (e) {
      console.log("error", e);
    }
  }
  getData();
}
function error(message) {
  console.log("user declined location access");
}
