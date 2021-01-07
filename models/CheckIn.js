const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	LastName: {
		type: String,
	},
	email: {
		type: String,
	},
	phone: {
		type: String,
	},
	room: {
		type: String,
	},
	price: {
		type: number,
	},
	checkinDate: {
		type: Date,
		default: Date.now(),
	},
	checkoutDate: {
		type: Date,
	},
});

const User = mongoose.model('User', userSchema);
module.exports = User;
