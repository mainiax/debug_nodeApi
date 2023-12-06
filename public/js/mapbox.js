export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibWFpbmlheCIsImEiOiJjbHA5czZiMHowMDcwMmpreG1oeGhydG85In0.8ZYoUCF5jPmcnrwIBKZvmQ';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mainiax/clp9syecl001x01qjbmcz25f0',
    scrollZoom: false,
  });
  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach((element) => {
    //create marker
    const el = document.createElement('div');
    el.className = 'marker';
    //add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(element.coordinates)
      .addTo(map);
    //add popup
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(element.coordinates)
      .setHTML(`<p>Day ${element.description}<p>`)
      .addTo(map);
    //extend map bounds to include current location
    bounds.extend(element.coordinates);
  });
  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 150, left: 100, right: 100 },
  });
};
