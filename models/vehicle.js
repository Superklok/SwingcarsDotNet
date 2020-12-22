const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VehicleSchema = new Schema({
	name: String,
	price: String,
	description: String,
	location: String
})

module.exports = mongoose.model('Vehicle', VehicleSchema);