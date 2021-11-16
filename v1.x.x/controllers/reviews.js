const Vehicle = require('../models/vehicle'),
	  Review  = require('../models/review');

module.exports.createReview = async (req, res) => {
	const vehicle = await Vehicle.findById(req.params.id);
	const review = new Review(req.body.review);
	review.motorist = req.user._id;
	vehicle.reviews.push(review);
	await review.save();
	await vehicle.save();
	req.flash('success', 'Thanks for leaving a review!');
	res.redirect(`/vehicles/${ vehicle._id }`);
}

module.exports.destroyReview = async (req, res) => {
	const { id, reviewId } = req.params;
	await Vehicle.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
	await Review.findByIdAndDelete(reviewId);
	req.flash('success', 'Your review has been deleted successfully!');
	res.redirect(`/vehicles/${ id }`);
}