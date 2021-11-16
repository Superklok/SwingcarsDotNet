const express                                     = require('express'),
	  router                                      = express.Router(),
	  vehicles                                    = require('../controllers/vehicles'),
	  catchAsync                                  = require('../HELPeR/catchAsync'),
	  { isLoggedIn, isMotorist, validateVehicle } = require('../middleware'),
	  multer                                      = require('multer'),
	  { storage }                                 = require('../cloudinary'),
	  upload                                      = multer({ storage });

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