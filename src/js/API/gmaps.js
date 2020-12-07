export function showSearchMarkers(arr, position) {
  const image =
    "https://raw.githubusercontent.com/Avixph/-Munch-Map-Redux/d9f5320ac16d436d1f0acf174b0cdb7071651b88/src/images/icons/MM-Icon.svg";
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
