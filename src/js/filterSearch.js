import { appendRestaurants } from './appendRestaurants.js';
import axios from 'axios';
import { config, ZOMATO_KEY, ZOMATO_URL } from './config.js';

export function filterSearch(searchInput, x, y, div) {
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
    });
    costLowToHigh.addEventListener('click', async () => {
        const getLowCostSort = await axios.get(
            `${ZOMATO_URL}search?q=${searchInput}&count=50&lat=${x}&lon=${y}&sort=cost&order=asc`,
            config
        );
        appendRestaurants(getLowCostSort.data.restaurants, div);
    });
    costHighToLow.addEventListener('click', async () => {
        const getHighCostSort = await axios.get(
            `${ZOMATO_URL}search?q=${searchInput}&count=50&lat=${x}&lon=${y}&sort=cost&order=desc`,
            config
        );
        appendRestaurants(getHighCostSort.data.restaurants, div);
    });
    distanceFilter.addEventListener('click', async () => {
        const getDistanceFilter = await axios.get(
            `${ZOMATO_URL}search?q=${searchInput}&count=50&lat=${x}&lon=${y}&sort=real_distance`,
            config
        );
        appendRestaurants(getDistanceFilter.data.restaurants, div);
    });
}