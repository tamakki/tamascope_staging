var map;
var markers = [];
function initAutocomplete(location) {

  /**
   * 角度を時間に変換
   * @param {number} deg 角度[deg] 
   */
  deg2time = function (deg) {
    if (deg === null || deg === undefined || isNaN(deg)) {
      return "";
    }
    while (deg < 0) {
      deg += 360;
    }
    //deg = deg % 30;
    let time = "";
    time += (Math.floor(deg) + "°");
    time += ("0" + Math.round((deg - Math.floor(deg)) * 60) + "'").slice(-3);

    return time;
  }

  map = new google.maps.Map(document.getElementById("map"), {
    center: location ? location : { lat: 35.7, lng: 139.7 },
    zoom: 7,
    mapTypeId: "roadmap",
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  });
  // Create the search box and link it to the UI element.
  // const input = document.getElementById("pac-input");
  // const searchBox = new google.maps.places.SearchBox(input);

  //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  // map.addListener("bounds_changed", () => {
  //   searchBox.setBounds(map.getBounds());
  // });

  map.addListener("center_changed", () => {
    if(map.center) {
      document.getElementById('map_lon').value = deg2time(map.center.lng());
      document.getElementById('map_lat').value = deg2time(map.center.lat());
    }
  });

  //let markers = [];

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  // searchBox.addListener("places_changed", () => {
  //   const places = searchBox.getPlaces();
  //   myPlaces = places;

  //   if (places.length == 0) {
  //     return;
  //   }

  // Clear out the old markers.
  // markers.forEach((marker) => {
  //   marker.setMap(null);
  // });
  // markers = [];

  // For each place, get the icon, name and location.
  // const bounds = new google.maps.LatLngBounds();

  // places.forEach((place) => {
  //   if (!place.geometry || !place.geometry.location) {
  //     console.log("Returned place contains no geometry");
  //     return;
  //   }

  // // Create a marker for each place.
  // const icon = {
  //   size: new google.maps.Size(71, 71),
  //   origin: new google.maps.Point(0, 0),
  //   anchor: new google.maps.Point(17, 34),
  //   scaledSize: new google.maps.Size(25, 25),
  // };

  // Create a marker for each place.
  //     const marker =
  //       new google.maps.Marker({
  //         map,
  //         title: place.name,
  //         position: place.geometry.location,
  //       });
  //     marker.addListener("click", () => {
  //       map.setCenter(marker.getPosition());
  //     });
  //     markers.push(marker);
  //     if (place.geometry.viewport) {
  //       // Only geocodes have viewport.
  //       bounds.union(place.geometry.viewport);
  //     } else {
  //       bounds.extend(place.geometry.location);
  //     }

  //     if (place.geometry.viewport) {
  //       // Only geocodes have viewport.
  //       bounds.union(place.geometry.viewport);
  //     } else {
  //       bounds.extend(place.geometry.location);
  //     }
  //   });
  //   map.fitBounds(bounds);
  //   if (markers.length === 1) {
  //     map.setCenter(markers[0].getPosition());
  //   }
  // });
}

window.initAutocomplete = initAutocomplete;

$(document).on("click", "#map-search", () => {
  const keyword = $("#pac-input").val();
  if (keyword) {
    const request = {
      location: map.center,
      radius: 500,
      query: keyword,
      fields: ["name", "geometry"],
    };

    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, (results, status) => {
      markers.forEach(marker => {
        marker.setMap(null);
      })
      markers = [];
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const bounds = new google.maps.LatLngBounds();
        for (let i = 0; i < results.length; i++) {
          createMarker(results[i]);
          bounds.extend(results[i].geometry.location)
        }
        map.fitBounds(bounds);
        if(results.length === 1) {
          map.setCenter(results[0].geometry.location);
        }
      }
    });
  }
})


function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });
  markers.push(marker);

  google.maps.event.addListener(marker, "click", () => {
    map.setCenter(place.geometry.location);
  });
}

$(document).on("click", "#location-picker", () => {
  const lon = parseFloat(document.getElementById("longitude-deg").value) + (document.getElementById("longitude-min").value / 60)
  const lat = parseFloat(document.getElementById("latitude-deg").value) + (document.getElementById("latitude-min").value / 60);
  map.setCenter({ lng: lon, lat: lat });
  $("#location_picker_dialog").modal();
});

$(document).on("click", "#set-location", () => {
  const longitude = map.center.lng();
  const latitude = map.center.lat();
  document.getElementById("longitude-deg").value = Math.floor(longitude);
  document.getElementById("longitude-min").value = Math.round((longitude - Math.floor(longitude)) * 60);
  document.getElementById("latitude-deg").value = Math.floor(latitude);
  document.getElementById("latitude-min").value = Math.round((latitude - Math.floor(latitude)) * 60);
  changeSetting();
  calc();
});
