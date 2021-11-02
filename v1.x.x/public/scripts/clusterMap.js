mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
	container: 'clusterMap',
	style: 'mapbox://styles/mapbox/dark-v10',
	center: [-95.3468, 54.5304],
	zoom: 3
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', function () {
	map.addSource('vehicles', {
		type: 'geojson',
		data: vehicles,
		cluster: true,
		clusterMaxZoom: 14,
		clusterRadius: 50
	});

	map.addLayer({
		id: 'clusters',
		type: 'circle',
		source: 'vehicles',
		filter: ['has', 'point_count'],
		paint: {
			'circle-color': [
				'step',
				['get', 'point_count'],
				'#00E5FF',
				25,
				'#1E90FF',
				50,
				'#E91E63'
			],
			'circle-radius': [
				'step',
				['get', 'point_count'],
				22,
				25,
				29,
				50,
				36
			]
		}
	});

	map.addLayer({
		id: 'cluster-count',
		type: 'symbol',
		source: 'vehicles',
		filter: ['has', 'point_count'],
		layout: {
			'text-field': '{point_count_abbreviated}',
			'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
			'text-size': 12
		}
	});

	map.addLayer({
		id: 'unclustered-point',
		type: 'circle',
		source: 'vehicles',
		filter: ['!', ['has', 'point_count']],
		paint: {
			'circle-color': '#4DD0E1',
			'circle-radius': 4,
			'circle-stroke-width': 1,
			'circle-stroke-color': '#FFF'
		}
	});

	map.on('click', 'clusters', function (e) {
		const features = map.queryRenderedFeatures(e.point, {
			layers: ['clusters']
		});
		const clusterId = features[0].properties.cluster_id;
		map.getSource('vehicles').getClusterExpansionZoom(
			clusterId,
			function (err, zoom) {
				if (err) return;

				map.easeTo({
					center: features[0].geometry.coordinates,
					zoom: zoom
				});
			}
		);
	});

	map.on('click', 'unclustered-point', function (e) {
		const { clusterPopUp } = e.features[0].properties;
		const coordinates = e.features[0].geometry.coordinates.slice();


	while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
		coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
	}

	new mapboxgl.Popup()
	.setLngLat(coordinates)
	.setHTML(clusterPopUp)
	.addTo(map)
	});

	map.on('mouseenter', 'clusters', function () {
		map.getCanvas().style.cursor = 'pointer';
	});
	map.on('mouseleave', 'clusters', function () {
		map.getCanvas().style.cursor = '';
	});
});