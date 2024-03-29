if (process.env.NODE_ENV !== "production") {
	require('dotenv').config();
}

const mongoose          = require('mongoose'),
	  { makes, models } = require('./vehicleNames'),
	  { descriptions }  = require('./vehicleDescriptions'),
	  vehicleLocations  = require('./vehicleLocations'),
	  vehicleImg1       = require('./vehicleImg1'),
	  vehicleImg2       = require('./vehicleImg2'),
	  Vehicle           = require('../models/vehicle');

// Production Database
// const dbUrl = process.env.DB_URL;

// Development Database
const dbUrl = 'mongodb://localhost:27017/swingcarsdotnet';

mongoose.connect(dbUrl, {
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
	for (let i = 0; i < 400; i++) {
		const random14 = Math.floor(Math.random() * 14);
		const random30Img1 = Math.floor(Math.random() * 30);
		const random30Img2 = Math.floor(Math.random() * 30);
		const price = Math.floor(Math.random() * 10) + 10;
		const vehicle = new Vehicle({

			// **motorist: 'ObjectId' (In MongoDB Shell, run db.users.find() once a user has been created.)**

			// Production Database User
			// motorist: '5ff382058fddb542f0f5e09f',

			// Development Database User
			motorist: '5fe5086e09768541ec5756a4',
			
			name: `${ sample(makes)} ${sample(models) }`,
			location: `${ vehicleLocations[random14].city }, ${ vehicleLocations[random14].province }`,
			description: `${ sample(descriptions) }`,
			price,
			geometry: {
				type: 'Point',
				coordinates: [
					vehicleLocations[random14].longitude,
					vehicleLocations[random14].latitude
				]
			},
			images: [
				{
					url: `${ vehicleImg1[random30Img1].url }`,
					filename: `${ vehicleImg1[random30Img1].filename }`
				},
				{
					url: `${ vehicleImg2[random30Img2].url }`,
					filename: `${ vehicleImg2[random30Img2].filename }`
				}
			]
		})
		await vehicle.save();
	}
}

seedDB().then(() => {
	mongoose.connection.close();
})