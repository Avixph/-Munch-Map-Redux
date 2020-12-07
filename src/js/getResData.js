export function getResData(restaurantData) {
    const allRestaurants = {};

    for (let item of restaurantData) {
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

    return Object.values(allRestaurants);
}