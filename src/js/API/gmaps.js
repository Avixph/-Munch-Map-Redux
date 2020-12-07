// const initMap = () => {
//     // GMAPS JS API IS LOADED AND AVAILABLE
//     const userLocation = { lat: latitude, lng: longitude };
//     const image =
//         "https://raw.githubusercontent.com/Avixph/-Munch-Map-Redux/developer/src/images/logos/flag.png";
//     const map = new google.maps.Map(document.getElementById("map"), {
//         zoom: 14,
//         center: userLocation,
//     });
//     new google.maps.Marker({
//         position: userLocation,
//         map,
//         title: "munch map!",
//     });

//     for (let item of restaurantValues) {
//         const marker = new google.maps.Marker({
//             position: item.ResCoordinates,
//             map,
//             icon: image,
//         });
//     }
// };
// // Append the 'script' element to 'head'


// export { initMap };