// exporting to gmaps
// exporting to index.js

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const ZOMATO_URL = process.env.ZOMATO_URL;
const ZOMATO_KEY = process.env.ZOMATO_KEY;

// TEMPORARY PLACEHOLDERS FOR LAT AND LONG
let longitude = -73.9571;
let latitude = 40.7081;


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
        // GETTING CUISINE DATA
        const cuisine = await axios.get(`${ZOMATO_URL}cuisines?lat=${latitude}&lon=${longitude}`, config);
        // GETTING REVIEWS DATA
        const reviews = await axios.get(`${ZOMATO_URL}reviews?res_id=${restaurant_id}`, config);



        console.log(geocode, cuisine, reviews);
    } catch (e) {
        console.log('error', e);
    }
}

getData();