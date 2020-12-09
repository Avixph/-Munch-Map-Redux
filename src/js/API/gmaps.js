export async function showSearchMarkers(arr, position, zoomLevel) {
  const image =
    "https://raw.githubusercontent.com/Avixph/-Munch-Map-Redux/c47b818f43e4ad6b7a0dff30050b72002180fbf0/src/images/icons/MM-Icon-sm.svg";
  let map;
  map = new google.maps.Map(document.getElementById("map"), {
    center: position,
    zoom: zoomLevel,
  });

  new google.maps.Marker({
    position: position,
    map,
    title: "munch map!",
  });

  for (let item of await arr) {
    const marker = new google.maps.Marker({
      position: item.ResCoordinates,
      map,
      icon: image,
    });
  }
}
