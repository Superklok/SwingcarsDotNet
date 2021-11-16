const {vehicleSchema, reviewSchema} = require('./schemas.js'),
	  ExpressError                  = require('./HELPeR/ExpressError'),
	  Vehicle                       = require('./models/vehicle'),
	  Review                        = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.flash('error', 'Only registered members are able to do that.');
		return res.redirect('/login');
	}
	next();
}

module.exports.validateVehicle = (req, res, next) => {
	const {error} = vehicleSchema.validate(req.body);
	if (error) {
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
}

module.exports.isMotorist = async (req, res, next) => {
	const {id} = req.params;
	const vehicle = await Vehicle.findById(id);
	if (!vehicle.motorist.equals(req.user._id)) {
		req.flash('error', 'Please log in as the member who owns this vehicle to do that.');
		return res.redirect(`/vehicles/${id}`);
	}
	next();
}

module.exports.isReviewer = async (req, res, next) => {
	const {id, reviewId} = req.params;
	const review = await Review.findById(reviewId);
	if (!review.motorist.equals(req.user._id)) {
		req.flash('error', 'Please log in as the member who left this review to do that.');
		return res.redirect(`/vehicles/${id}`);
	}
	next();
}

module.exports.validateReview = (req, res, next) => {
	const {error} = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
}