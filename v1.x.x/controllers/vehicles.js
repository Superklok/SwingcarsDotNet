const Vehicle = require('../models/vehicle');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
	if (!req.query.page) {
		const vehicles = await Vehicle.paginate({}, {});
		res.render('vehicles/index', { vehicles });
	} else {
		const { page } = req.query;
		const vehicles = await Vehicle.paginate({}, {
			page
		});
		res.status(200).json(vehicles);
	}
}

module.exports.renderNewForm = (req, res) => {
	res.render('vehicles/new');
}

module.exports.createVehicle = async (req, res, next) => {
	const geoData = await geocoder.forwardGeocode({
		query: req.body.vehicle.location,
		limit: 1
	}).send()
	const vehicle = new Vehicle(req.body.vehicle);
	vehicle.geometry = geoData.body.features[0].geometry;
	vehicle.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
	vehicle.motorist = req.user._id;
	await vehicle.save();
	req.flash('success', 'Successfully listed a new vehicle!');
	res.redirect(`/vehicles/${ vehicle._id }`);
}

module.exports.showVehicle = async(req, res) => {
	const vehicle = await Vehicle.findById(req.params.id).populate({
		path: 'reviews',
		populate: {
			path: 'motorist'
		}
	}).populate('motorist');
	if (!vehicle) {
		req.flash('error', 'Sorry, the vehicle you requested cannot be found.');
		return res.redirect('/vehicles');
	}
	res.render('vehicles/show', { vehicle });
}

module.exports.renderEditForm = async (req, res) => {
	const { id } = req.params;
	const vehicle = await Vehicle.findById(id)
	if (!vehicle) {
		req.flash('error', 'Sorry, the vehicle you requested cannot be found.');
		return res.redirect('/vehicles');
	}
	res.render('vehicles/edit', { vehicle });
}

module.exports.updateVehicle = async (req, res) => {
	const { id } = req.params;
	const vehicle = await Vehicle.findByIdAndUpdate(id, { ...req.body.vehicle });
	const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
	vehicle.images.push(...imgs);
	await vehicle.save();
	if (req.body.destroyImg) {
		for (let filename of req.body.destroyImg) {
			await cloudinary.uploader.destroy(filename);
		}
		await vehicle.updateOne({ $pull: { images: { filename: { $in: req.body.destroyImg } } } });
	}
	req.flash('success', 'Vehicle updated successfully!');
	res.redirect(`/vehicles/${ vehicle._id }`);
}

module.exports.destroyVehicle = async (req, res) => {
	const { id } = req.params;
	await Vehicle.findByIdAndDelete(id);
	req.flash('success', 'Vehicle deleted successfully!');
	res.redirect('/vehicles');
}