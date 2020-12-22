const mongoose = require('mongoose');
const {makes, models} = require('./vehicleNames');
const {descriptions} = require('./vehicleDescriptions');
const vehicleLocations = require('./vehicleLocations');
const Vehicle = require('../models/vehicle');

mongoose.connect('mongodb://localhost:27017/swingcarsdotnet', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("SwingcarsDotNet database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Vehicle.deleteMany({});
	for (let i = 0; i < 14; i++) {
		const random14 = Math.floor(Math.random() * 14);
		const price = Math.floor(Math.random() * 10) + 10;
		const vehicle = new Vehicle({
			name: `${sample(makes)} ${sample(models)}`,
			location: `${vehicleLocations[random14].city}, ${vehicleLocations[random14].province}`,
			image: 'https://source.unsplash.com/collection/430968',
			description: `${sample(descriptions)}`,
			price
		})
		await vehicle.save();
	}
}

seedDB().then(() => {
	mongoose.connection.close();
})