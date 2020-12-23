const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const {vehicleSchema, reviewSchema} = require('./schemas.js');
const catchAsync = require('./HELPeR/catchAsync');
const ExpressError = require('./HELPeR/ExpressError');
const methodOverride = require('method-override');
const Vehicle = require('./models/vehicle');
const Review = require('./models/review');

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

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const validateVehicle = (req, res, next) => {
	const {error} = vehicleSchema.validate(req.body);
	if(error){
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400)
	} else {
		next();
	}
}

const validateReview = (req, res, next) => {
	const {error} = reviewSchema.validate(req.body);
	if(error){
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400)
	} else {
		next();
	}
}

app.get('/', (req, res) => {
	res.render('home')
});

app.get('/vehicles', catchAsync(async (req, res) => {
	const vehicles = await Vehicle.find({});
	res.render('vehicles/index', {vehicles})
}));

app.get('/vehicles/new', (req, res) => {
	res.render('vehicles/new');
});

app.post('/vehicles', validateVehicle, catchAsync(async (req, res, next) => {
	const vehicle = new Vehicle(req.body.vehicle);
	await vehicle.save();
	res.redirect(`/vehicles/${vehicle._id}`)
}));

app.get('/vehicles/:id', catchAsync(async(req, res) => {
	const vehicle = await Vehicle.findById(req.params.id).populate('reviews');
	res.render('vehicles/show', {vehicle});
}));

app.get('/vehicles/:id/edit', catchAsync(async (req, res) => {
	const vehicle = await Vehicle.findById(req.params.id)
	res.render('vehicles/edit', {vehicle});
}));

app.put('/vehicles/:id', validateVehicle, catchAsync(async (req, res) => {
	const {id} = req.params;
	const vehicle = await Vehicle.findByIdAndUpdate(id, {...req.body.vehicle});
	res.redirect(`/vehicles/${vehicle._id}`)
}));

app.delete('/vehicles/:id', catchAsync(async (req, res) => {
	const {id} = req.params;
	await Vehicle.findByIdAndDelete(id);
	res.redirect('/vehicles');
}));

app.post('/vehicles/:id/reviews', validateReview, catchAsync(async (req, res) => {
	const vehicle = await Vehicle.findById(req.params.id);
	const review = new Review(req.body.review);
	vehicle.reviews.push(review);
	await review.save();
	await vehicle.save();
	res.redirect(`/vehicles/${vehicle._id}`);
}));

app.delete('/vehicles/:id/reviews/:reviewId', catchAsync(async (req, res) => {
	const {id, reviewId} = req.params;
	await Vehicle.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
	await Review.findByIdAndDelete(reviewId);
	res.redirect(`/vehicles/${id}`);
}));

app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
	const {statusCode = 500} = err;
	if (!err.message) err.message = 'Oh no! Something went wrong!'
	res.status(statusCode).render('error', {err});
});

app.listen(3000, ()=> {
	console.log('Serving on port 3000')
})