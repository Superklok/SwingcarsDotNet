mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: vehicle.geometry.coordinates,
	zoom: 10
});

new mapboxgl.Marker()
	.setLngLat(vehicle.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({offset: 25})
			.setHTML(
				`<h3>${ vehicle.name }</h3><p>${ vehicle.location }</p>`
			)
	)
	.addTo(map)