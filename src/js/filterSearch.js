import { appendRestaurants } from './appendRestaurants.js';
import axios from 'axios';
import { config, ZOMATO_KEY, ZOMATO_URL } from './config.js';
import { showSearchMarkers } from './API/gmaps.js';

// export async function showSearchMarkers(arr, position, zoomLevel) {

export function filterSearch(searchInput, x, y, div) {

    // const userLoc = { lat: 40.7128, long: -74.0060 };

    const ratingFilter = document.querySelector('.rating-filter');
    const costLowToHigh = document.querySelector('.low-cost-filter');
    const costHighToLow = document.querySelector('.high-cost-filter');
    const distanceFilter = document.querySelector('.distance-filter');

    ratingFilter.addEventListener('click', async () => {
        const getRatingSort = await axios.get(
            `${ZOMATO_URL}search?q=${searchInput}&count=50&lat=${x}&lon=${y}&sort=rating`,
            config
        );
        // showSearchMarkers(Object.values(getRatingSort), userLoc, 10);
        appendRestaurants(getRatingSort.data.restaurants, div);

    });
    costLowToHigh.addEventListener('click', async () => {
        const getLowCostSort = await axios.get(
            `${ZOMATO_URL}search?q=${searchInput}&count=50&lat=${x}&lon=${y}&sort=cost&order=asc`,
            config
        );
        // showSearchMarkers(Object.values(getLowCostSort), userLoc, 10);
        appendRestaurants(getLowCostSort.data.restaurants, div);
    });
    costHighToLow.addEventListener('click', async () => {
        const getHighCostSort = await axios.get(
            `${ZOMATO_URL}search?q=${searchInput}&count=50&lat=${x}&lon=${y}&sort=cost&order=desc`,
            config
        );
        // showSearchMarkers(Object.values(getHighCostSort), userLoc, 10);
        appendRestaurants(getHighCostSort.data.restaurants, div);
    });
    distanceFilter.addEventListener('click', async () => {
        const getDistanceFilter = await axios.get(
            `${ZOMATO_URL}search?q=${searchInput}&count=50&lat=${x}&lon=${y}&sort=real_distance`,
            config
        );
        // showSearchMarkers(Object.values(getDistanceFilter), userLoc, 10);
        appendRestaurants(getDistanceFilter.data.restaurants, div);
    });
}