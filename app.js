//NPM modules
require('dotenv').config(); //require the config files
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitizer = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//user defined modules
//const customerRoute = require('./routes/customer');

// db controller
//const connectToDB = require('./controllers/dbController');

//connectToDB();

const app = express();
app.enable('trust proxy');

//middlewares
//middleware to set security HTTP headers
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json({ extended: false })); //middleware for body-paser
app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));
app.use(bodyParser.json());
app.use(cors()); //middle ware to allow cross origin resource sharing

//protect DB from NOSQL query injections using the express-mongo-sanitize middleware
// interset the req.body, req.params, and req.query and remove malicious codes
app.use(mongoSanitizer());

//protect data from xss attack using the xss-clean middleware
// work on HTML to sanitize the data from malicious script
app.use(xss());

//cookie parser for parsing the the request cookies
app.use(cookieParser());

//protect against parameter pollution using the hpp middleware
//works on url parameters to sanitize it eg. remove duplicate parameters
app.use(hpp({ whitelist: [] })); // use the whitelist option to specify some parameter that you want to allow duplicate in the array

//routes

//app.use('/api/v1/customers', customerRoute); //users route

//catch undefined endpoints
// app.use(undefinedRoutes);

//spin up the server on the env port number
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
