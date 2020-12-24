const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../HELPeR/catchAsync');
const {reviewSchema} = require('../schemas.js');
const ExpressError = require('../HELPeR/ExpressError');
const Vehicle = require('../models/vehicle');
const Review = require('../models/review');

const validateReview = (req, res, next) => {
	const {error} = reviewSchema.validate(req.body);
	if(error){
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400)
	} else {
		next();
	}
}

router.post('/', validateReview, catchAsync(async (req, res) => {
	const vehicle = await Vehicle.findById(req.params.id);
	const review = new Review(req.body.review);
	vehicle.reviews.push(review);
	await review.save();
	await vehicle.save();
	req.flash('success', 'Thanks for leaving a review!');
	res.redirect(`/vehicles/${vehicle._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
	const {id, reviewId} = req.params;
	await Vehicle.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
	await Review.findByIdAndDelete(reviewId);
	req.flash('success', 'Your review has been successfully deleted!');
	res.redirect(`/vehicles/${id}`);
}));

module.exports = router;