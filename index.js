/* =============
	Import Node Modules
============= */
const express = require('express'); // Fast, unopinionated, minimalist web framework for node
const app = express(); //// Initiate Express Application
const router = express.Router(); // Creates a new router object.
const mongoose = require('mongoose'); // Node Tool for MongoDB
const config = require('./config/database'); // Mongoose Config
const path = require('path'); // NodeJS Package for file paths
const authentication = require('./routes/authentication')(router); // Import Authentication Routes
const bodyParser = require('body-parser'); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const cors = require('cors'); // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

//Database Connection
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
	if (err) {
		console.log('Could NOT connect to database: ', err);
	} else {
		console.log('Connected to database: ' + config.db);
	}
});

// Middleware
app.use(cors({
	origin: 'http://localhost:4200'
}));

// Provide static directory for frontend
// parse application/x-ww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(express.static(__dirname + '/player-app/dist/'));
app.use('/authentication', authentication);

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/player-app/dist/index.html'));
});

// Start Server: Listen on port 8080
app.listen(8080, () => {
	console.log('Listening on port 8080');
});