const Joi = require('joi');

module.exports.vehicleSchema = Joi.object({
	vehicle: Joi.object({
		name: Joi.string().required(),
		price: Joi.number().required().min(0),
		location: Joi.string().required(),
		description: Joi.string().required()
	}).required(),
	destroyImg: Joi.array()
});

module.exports.reviewSchema = Joi.object({
	review: Joi.object({
		rating: Joi.number().required().min(0).max(5),
		body: Joi.string().required()
	}).required()
});