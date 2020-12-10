import axios from 'axios';
import { appendRestaurants } from './appendRestaurants.js';
import { config, ZOMATO_KEY, ZOMATO_URL } from './config.js';
import { showSearchMarkers } from './API/gmaps.js';
import { getResData } from './getResData.js';

export function filterSearch(searchInput, x, y, div) {

    const location = { lat: x, lng: y };

    const ratingFilter = document.querySelector('.rating-filter');
    const costLowToHigh = document.querySelector('.low-cost-filter');
    const costHighToLow = document.querySelector('.high-cost-filter');
    const distanceFilter = document.querySelector('.distance-filter');

    ratingFilter.addEventListener('click', async () => {
        const getRatingSort = await axios.get(
            `${ZOMATO_URL}search?q=${searchInput}&count=50&lat=${x}&lon=${y}&sort=rating`,
            config
        );
        appendRestaurants(getRatingSort.data.restaurants, div);
        showSearchMarkers(getResData(getRatingSort.data.restaurants), location, 10);
    });
    costLowToHigh.addEventListener('click', async () => {
        const getLowCostSort = await axios.get(
            `${ZOMATO_URL}search?q=${searchInput}&count=50&lat=${x}&lon=${y}&sort=cost&order=asc`,
            config
        );
        appendRestaurants(getLowCostSort.data.restaurants, div);
        showSearchMarkers(getResData(getLowCostSort.data.restaurants), location, 10);
    });
    costHighToLow.addEventListener('click', async () => {
        const getHighCostSort = await axios.get(
            `${ZOMATO_URL}search?q=${searchInput}&count=50&lat=${x}&lon=${y}&sort=cost&order=desc`,
            config
        );
        appendRestaurants(getHighCostSort.data.restaurants, div);
        showSearchMarkers(getResData(getHighCostSort.data.restaurants), location, 10);
    });
    distanceFilter.addEventListener('click', async () => {
        const getDistanceFilter = await axios.get(
            `${ZOMATO_URL}search?q=${searchInput}&count=50&lat=${x}&lon=${y}&sort=real_distance`,
            config
        );
        appendRestaurants(getDistanceFilter.data.restaurants, div);
        showSearchMarkers(getResData(getDistanceFilter.data.restaurants), location, 10);
    });
}
