export function showSearchMarkers(arr, position) {
    const image =
        "https://raw.githubusercontent.com/Avixph/-Munch-Map-Redux/developer/src/images/logos/flag.png";
    let map;
    map = new google.maps.Map(document.getElementById("map"), {
        center: position,
        zoom: 10,
    });

    new google.maps.Marker({
        position: position,
        map,
        title: "munch map!",
    });

    for (let item of arr) {
        const marker = new google.maps.Marker({
            position: item.ResCoordinates,
            map,
            icon: image,
        });
    }
}