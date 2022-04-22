var map, searchManager;
window.GetMap = () => {
  map = new Microsoft.Maps.Map('#map');

  Microsoft.Maps.loadModule(['Microsoft.Maps.Search','Microsoft.Maps.AutoSuggest'], function () {
    // AutoSuggestion
    const manager = new Microsoft.Maps.AutosuggestManager({
      map: map,
      businessSuggestions: true
    });
    manager.attachAutosuggest('#keyword', '#searchBoxContainer', suggestSelected);

    // Search
    searchManager = new Microsoft.Maps.Search.SearchManager(map);
  });

  // 中心移動イベント
  Microsoft.Maps.Events.addHandler(map, 'viewchange', () => {
    const center = map.getCenter();
    onChangeLocation(center);
  });
  const location = new Microsoft.Maps.Location(35.7, 139.7);
  map.setView({center: location});
}

const suggestSelected = (result) => {
  onChangeLocation(result.location);
  map.setView({bounds: result.bestView});
}

const searchSuccess = (r) => {
  if(r && r.results && r.results.length > 0) {
    map.entities.clear();
    const pins = [];
    const locs = [];
    r.results.forEach((result, i) => {
      const pin = new Microsoft.Maps.Pushpin(result.location, {
          text: i + ''
      });
      pins.push(pin);
      Microsoft.Maps.Events.addHandler(pin, 'click', () => {
        map.setView({center: result.location});
      });
      locs.push(result.location);
    });
    map.entities.push(pins);
    if(r.results.length === 1) {
      map.setView({bounds: r.results[0].bestView})
    } else {
      map.setView({bounds: Microsoft.Maps.LocationRect.fromLocations(locs), padding: 30});
    }
  } else {
    searchFail();
  }
}
const searchFail = (e) => {
  alert('該当する住所がありませんでした');
}
const locationSearch = () => {
  const query = document.getElementById('keyword').value;
  const searchRequest = {
    where: query,
    callback: searchSuccess,
    errorCallback: searchFail,
  }
  searchManager.geocode(searchRequest);
}

const onChangeLocation = (location) => {
  const lat = location.latitude;
  const lon = location.longitude;
  document.getElementById('locationPicker-lat').value = Math.floor(lat) + '°' + Math.floor((lat - Math.floor(lat)) * 60) + "'";
  document.getElementById('locationPicker-lng').value = Math.floor(lon) + '°' + Math.floor((lon - Math.floor(lon)) * 60) + "'";
  map.setView({bounds: result.bestView});
}

$(document).on('click', '#openLocationPicker', () => {
  const lat = parseFloat(setting['latitude-deg']) + parseFloat(setting['latitude-min']) / 60;
  const lon = parseFloat(setting['longitude-deg']) + parseFloat(setting['longitude-min']) / 60;
  const location = {
    latitude: lat,
    longitude: lon,
  }
  map.setView({center: location});
  onChangeLocation(location);
  $('#locationPicker').modal();
});

$(document).on('click', '#pickLocation', () => {
  const center = map.getCenter();
  document.getElementById('longitude-deg').value = Math.floor(center.longitude);
  document.getElementById('longitude-min').value = Math.floor((center.longitude % 1) * 60);
  document.getElementById('latitude-deg').value = Math.floor(center.latitude);
  document.getElementById('latitude-min').value = Math.floor((center.latitude % 1) * 60);
  changeSetting();
  $.modal.close();
});