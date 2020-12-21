const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Vehicle = require('./models/vehicle');

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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
	res.render('home')
});

app.get('/vehicles', async (req, res) => {
	const vehicles = await Vehicle.find({});
	res.render('vehicles/index', {vehicles})
});

app.get('/vehicles/new', (req, res) => {
	res.render('vehicles/new');
});

app.post('/vehicles', async (req, res) => {
	const vehicle = new Vehicle(req.body.vehicle);
	await vehicle.save();
	res.redirect(`/vehicles/${vehicle._id}`)
});

app.get('/vehicles/:id', async(req, res) => {
	const vehicle = await Vehicle.findById(req.params.id)
	res.render('vehicles/show', {vehicle});
});

app.get('/vehicles/:id/edit', async (req, res) => {
	const vehicle = await Vehicle.findById(req.params.id)
	res.render('vehicles/edit', {vehicle});
});

app.put('/vehicles/:id', async (req, res) => {
	const {id} = req.params;
	const vehicle = await Vehicle.findByIdAndUpdate(id, {...req.body.vehicle});
	res.redirect(`/vehicles/${vehicle._id}`)
});

app.delete('/vehicles/:id', async (req, res) => {
	const {id} = req.params;
	await Vehicle.findByIdAndDelete(id);
	res.redirect('/vehicles');
});

app.listen(3000, ()=> {
	console.log('Serving on port 3000')
})