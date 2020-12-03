import axios from "axios";


if (navigator.geolocation) {
    console.log('Geolocation is supported!');
}
else {
    console.log('Geolocation is not supported for this Browser/OS version yet.');
}

let ZOMATO_KEY = process.env.ZOMATO_KEY;
let ZOMATO_URL = process.env.ZOMATO_URL;
let GMAPS_KEY = process.env.GMAPS_KEY;

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
                }
            };
            // GETTING GEOCODE DATA
            const geocode = await axios.get(`${ZOMATO_URL}geocode?lat=${latitude}&lon=${longitude}`, config);

            console.log(geocode);

            const allRestaurants = {};
            const topCuisines = [];
            const subzone = `${geocode.data.popularity.subzone}, ${geocode.data.popularity.city}`;

            console.log("Subzone: \n", subzone);
            for (let item of geocode.data.popularity.top_cuisines) {
                topCuisines.push(item);
            }

            console.log("Top cuisines in the area: \n", topCuisines);
            for (let item of geocode.data.nearby_restaurants) {

                if (item.restaurant.user_rating.aggregate_rating === 0) {
                    item.restaurant.user_rating.aggregate_rating = "No rating available";
                }

                allRestaurants[item.restaurant.name] =
                {
                    ResCoordinates: { latitude: item.restaurant.location.latitude, longitude: item.restaurant.location.longitude, },
                    RestaurantName: item.restaurant.name,
                    Score: `${item.restaurant.user_rating.aggregate_rating}/5.0`,
                    Cuisine: item.restaurant.cuisines,
                    AverageCost: `$${item.restaurant.average_cost_for_two}`,
                    PriceRange: `${item.restaurant.price_range}/5`,
                    Thumbnail: item.restaurant.thumb,
                    Location: `${item.restaurant.location.address}`
                };
            }

            let restaurantValues = Object.values(allRestaurants);
            console.log("Example restaurant:\n", restaurantValues[1]);



            // for (let item of resIDs) {
            //     const rev = await axios.get(`${ZOMATO_URL}reviews?res_id=${item}`, config);
            //     console.log(rev.data.user_reviews[0].review.rating_text);
            // }

            // for (let rating of reviews.data.user_reviews) {
            //     console.log(rating.review.rating_text);
            // }

            // for (let item of resIDs) {
            //     const reviews = await axios.get(`${ZOMATO_URL}reviews?res_id=${item}`, config);
            //     console.log(reviews);
            // }



        } catch (e) {
            console.log('error', e);
        }
    }

    getData();
}



function error(message) {
    console.log('user declined location access');
}