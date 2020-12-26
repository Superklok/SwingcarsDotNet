const express = require('express');
const router = express.Router();
const catchAsync = require('../HELPeR/catchAsync');
const {isLoggedIn, isMotorist, validateVehicle} = require('../middleware');
const Vehicle = require('../models/vehicle');

router.get('/', catchAsync(async (req, res) => {
	const vehicles = await Vehicle.find({});
	res.render('vehicles/index', {vehicles})
}));

router.get('/new', isLoggedIn, (req, res) => {
	res.render('vehicles/new');
});

router.post('/', isLoggedIn, validateVehicle, catchAsync(async (req, res, next) => {
	const vehicle = new Vehicle(req.body.vehicle);
	vehicle.motorist = req.user._id;
	await vehicle.save();
	req.flash('success', 'Successfully listed a new vehicle!');
	res.redirect(`/vehicles/${vehicle._id}`)
}));

router.get('/:id', catchAsync(async(req, res) => {
	const vehicle = await Vehicle.findById(req.params.id).populate({
		path: 'reviews',
		populate: {
			path: 'motorist'
		}
	}).populate('motorist');
	if (!vehicle) {
		req.flash('error', 'Unable to find that vehicle!');
		return res.redirect('/vehicles');
	}
	res.render('vehicles/show', {vehicle});
}));

router.get('/:id/edit', isLoggedIn, isMotorist, catchAsync(async (req, res) => {
	const {id} = req.params;
	const vehicle = await Vehicle.findById(id)
	if (!vehicle) {
		req.flash('error', 'Unable to find that vehicle!');
		return res.redirect('/vehicles');
	}
	res.render('vehicles/edit', {vehicle});
}));

router.put('/:id', isLoggedIn, isMotorist, validateVehicle, catchAsync(async (req, res) => {
	const {id} = req.params;
	const vehicle = await Vehicle.findByIdAndUpdate(id, {...req.body.vehicle});
	req.flash('success', 'Successfully updated vehicle!');
	res.redirect(`/vehicles/${vehicle._id}`)
}));

router.delete('/:id', isLoggedIn, isMotorist, catchAsync(async (req, res) => {
	const {id} = req.params;
	await Vehicle.findByIdAndDelete(id);
	req.flash('success', 'Vehicle successfully deleted!');
	res.redirect('/vehicles');
}));

module.exports = router;