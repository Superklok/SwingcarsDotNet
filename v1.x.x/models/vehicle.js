const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
	url: String,
	filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
	return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const VehicleSchema = new Schema({
	name: String,
	images: [ImageSchema],
	geometry: {
		type: {
			type: String,
			enum: ['Point'],
			required: true
		},
		coordinates: {
			type: [Number],
			required: true
		}
	},
	price: Number,
	description: String,
	location: String,
	motorist: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	]
}, opts);

VehicleSchema.virtual('properties.clusterPopUp').get(function () {
	return `
	<strong><a href="/vehicles/${ this._id }">${ this.name }</a></strong>
	<p>${ this.description.substring(0, 100) }...</p>`;
});

VehicleSchema.post('findOneAndDelete', async function (doc) {
	if (doc) {
		await Review.deleteMany({
			_id: {
				$in: doc.reviews
			}
		})
	}
});

module.exports = mongoose.model('Vehicle', VehicleSchema);