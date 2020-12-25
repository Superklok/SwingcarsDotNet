const express = require('express');
const router = express.Router();
const catchAsync = require('../HELPeR/catchAsync');
const {vehicleSchema} = require('../schemas.js');
const {isLoggedIn} = require('../middleware');
const ExpressError = require('../HELPeR/ExpressError');
const Vehicle = require('../models/vehicle');

const validateVehicle = (req, res, next) => {
	const {error} = vehicleSchema.validate(req.body);
	if(error){
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400)
	} else {
		next();
	}
}

router.get('/', catchAsync(async (req, res) => {
	const vehicles = await Vehicle.find({});
	res.render('vehicles/index', {vehicles})
}));

router.get('/new', isLoggedIn, (req, res) => {
	res.render('vehicles/new');
});

router.post('/', isLoggedIn, validateVehicle, catchAsync(async (req, res, next) => {
	const vehicle = new Vehicle(req.body.vehicle);
	await vehicle.save();
	req.flash('success', 'Successfully listed a new vehicle!');
	res.redirect(`/vehicles/${vehicle._id}`)
}));

router.get('/:id', catchAsync(async(req, res) => {
	const vehicle = await Vehicle.findById(req.params.id).populate('reviews');
	if(!vehicle){
		req.flash('error', 'Unable to find that vehicle!');
		return res.redirect('/vehicles');
	}
	res.render('vehicles/show', {vehicle});
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
	const vehicle = await Vehicle.findById(req.params.id)
	if(!vehicle){
		req.flash('error', 'Unable to find that vehicle!');
		return res.redirect('/vehicles');
	}
	res.render('vehicles/edit', {vehicle});
}));

router.put('/:id', isLoggedIn, validateVehicle, catchAsync(async (req, res) => {
	const {id} = req.params;
	const vehicle = await Vehicle.findByIdAndUpdate(id, {...req.body.vehicle});
	req.flash('success', 'Successfully updated vehicle!');
	res.redirect(`/vehicles/${vehicle._id}`)
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
	const {id} = req.params;
	await Vehicle.findByIdAndDelete(id);
	req.flash('success', 'Vehicle successfully deleted!');
	res.redirect('/vehicles');
}));

module.exports = router;