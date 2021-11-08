const paginate = document.getElementById('paginate');
const $vehiclesContainer = $('#vehicles-container');

paginate.addEventListener('click', function(e) {
	e.preventDefault();
	fetch(this.href)
		.then(response => response.json())
		.then(data => {
			for(const vehicle of data.docs) {
				let template = generateVehicle(vehicle);
				$vehiclesContainer.append(template);
			}
			let { nextPage } = data;
			this.href = this.href.replace(/page=\d+/, `page=${nextPage}`);
			vehicles.features.push(...data.docs);
			map.getSource('vehicles').setData(vehicles);
		})
		.catch(err => console.log(err));
})

function generateVehicle(vehicle) {
	let template = `<div class="card mb-3 nightBG">
						<div class="card m-3 neonBG">
							<div class="row">
								<div class="col-md-4">
									<img class="img-fluid" alt="" src="${ vehicle.images[0].url }">
								</div>
								<div class="col-md-8">
									<div class="card-body">
										<h5 class="card-title mdText contentFont">${ vehicle.name }</h5>
										<p class="card-text smText contentFont">${ vehicle.description.substring(0, 200) }...</p>
										<p class="card-text">
											<span class="smText contentFont">${ vehicle.location }</span>		
										</p>
										<a class="neonBtn mdBtn" href="/vehicles/${ vehicle._id }">View ${ vehicle.name }</a>
									</div>
								</div>
							</div>
						</div>
					</div>`;
					return template;
}