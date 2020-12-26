const express = require('express');
const router = express.Router({mergeParams: true});
const {validateReview, isLoggedIn, isReviewer} = require('../middleware');
const catchAsync = require('../HELPeR/catchAsync');
const ExpressError = require('../HELPeR/ExpressError');
const Vehicle = require('../models/vehicle');
const Review = require('../models/review');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
	const vehicle = await Vehicle.findById(req.params.id);
	const review = new Review(req.body.review);
	review.motorist = req.user._id;
	vehicle.reviews.push(review);
	await review.save();
	await vehicle.save();
	req.flash('success', 'Thanks for leaving a review!');
	res.redirect(`/vehicles/${vehicle._id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewer, catchAsync(async (req, res) => {
	const {id, reviewId} = req.params;
	await Vehicle.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
	await Review.findByIdAndDelete(reviewId);
	req.flash('success', 'Your review has been deleted successfully!');
	res.redirect(`/vehicles/${id}`);
}));

module.exports = router;