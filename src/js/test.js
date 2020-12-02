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
            // RESTAURANT ID FROM GEOCODE
            let restaurant_id = geocode.data.nearby_restaurants[0].restaurant.R.res_id;
            // GETTING REVIEWS DATA
            const reviews = await axios.get(`${ZOMATO_URL}reviews?res_id=${restaurant_id}`, config);

            console.log(geocode, reviews);

            for (let item of geocode.data.nearby_restaurants) {
                console.log(item.restaurant.name);
                console.log("Longitude: ", item.restaurant.location.longitude);
                console.log("Latitude:", item.restaurant.location.latitude);
            }

        } catch (e) {
            console.log('error', e);
        }
    }

    getData();
}



function error(message) {
    console.log('user declined location access');
}