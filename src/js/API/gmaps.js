export function showSearchMarkers(arr, position) {
  const image =
    "https://raw.githubusercontent.com/Avixph/-Munch-Map-Redux/3c1437507a08970278c7fd1253e1726a4b7470f8/src/images/icons/MM-Icon-sm.svg";
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
