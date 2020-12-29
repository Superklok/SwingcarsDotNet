mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
	container: 'showPageMap',
	style: 'mapbox://styles/mapbox/dark-v10',
	center: vehicle.geometry.coordinates,
	zoom: 13
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
	.setLngLat(vehicle.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({offset: 25})
			.setHTML(
				`<h3>${ vehicle.name }</h3><p>${ vehicle.location }</p>`
			)
	)
	.addTo(map)