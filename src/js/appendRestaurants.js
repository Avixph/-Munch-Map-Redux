import { getResData } from './getResData.js';
import { populateRestaurants } from './populateRestaurants.js';

function appendRestaurants(data, div) {
    // Check populate restaurant to see where we got .card-container
    const cardContainer = document.querySelectorAll(
        ".card-container"
    );
    for (let div of cardContainer) {
        div.remove();
    }
    for (let item of getResData(data)) {
        let resDiv = document.createElement("div");
        resDiv.classList.add("d-flex", "justify-content-center");
        resDiv.innerHTML = populateRestaurants(item);
        div.append(resDiv);
    }
}

export { appendRestaurants };