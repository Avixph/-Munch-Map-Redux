const restaurantSearch = ({
    RestaurantName,
    Score,
    ReviewText,
    Cuisine,
    AverageCost,
    PriceRange,
    FeaturedImg,
    Location,
}) => {
    return `
    <div class="col-lg-10 col-md-12 col-sm-12 card-container">
        <h1 class="text-center res-name">${RestaurantName}</h1>
        <div class="d-flex align-items-center row">
            <div class="col-lg-6 col-md-12 col-sm-12">
                <div class="restaurant-container">
                    <div class="col-12 card-info">
                        <ul>
                            <li>Cuisine: <span class="info">${Cuisine}</span></li>
                            <li>Price range: <span class="info money">${PriceRange}</span></li>
                            <li>Average cost for two: <span class="info">${Number(AverageCost) ? `$${AverageCost}` : `N/A`}</span></li>
                            <li>Location: <span class="info">${Location}</span></li>
                            <li>Score: <span class="info">${Number(Score) ? `${Score} / 5.0` : `N/A`}</span></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12">
                <div class="d-flex align-items-center food-container">
                    <div class="col-12 text-center food-pic">
              
                        <img src="${FeaturedImg ? FeaturedImg : "https://cdn.discordapp.com/attachments/661356197768855554/785260477022208030/404-img.png"}" alt="" /> 
                        <h3><span class="info review">"${ReviewText}"</span></h3>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
};



export { restaurantSearch };
