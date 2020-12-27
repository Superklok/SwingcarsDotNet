const express = require('express');
const router = express.Router();
const vehicles = require('../controllers/vehicles');
const catchAsync = require('../HELPeR/catchAsync');
const { isLoggedIn, isMotorist, validateVehicle } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
	.get(catchAsync(vehicles.index))
	.post(isLoggedIn, 
		upload.array('image'), 
		validateVehicle, 
		catchAsync(vehicles.createVehicle))

router.get('/new', 
	isLoggedIn, 
	vehicles.renderNewForm);

router.route('/:id')
	.get(catchAsync(vehicles.showVehicle))
	.put(isLoggedIn, 
		isMotorist, 
		upload.array('image'), 
		validateVehicle, 
		catchAsync(vehicles.updateVehicle))
	.delete(isLoggedIn, 
		isMotorist, 
		catchAsync(vehicles.destroyVehicle))

router.get('/:id/edit', 
	isLoggedIn, 
	isMotorist, 
	catchAsync(vehicles.renderEditForm));

module.exports = router;