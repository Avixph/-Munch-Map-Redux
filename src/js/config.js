let ZOMATO_KEY = process.env.ZOMATO_KEY;
let ZOMATO_URL = process.env.ZOMATO_URL;
let gMapUrl = process.env.GMAP_URL;
let gMapKey = process.env.GMAP_KEY;

const config = {
    headers: {
        Accept: "application/json",
        "user-key": `${ZOMATO_KEY}`,
    },
};

export { config, ZOMATO_KEY, ZOMATO_URL, gMapUrl, gMapKey };