const mongoose = require('mongoose');
const guestSchema = new mongoose.Schema({
	firstName: {
		type: String,
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
		default: Date.now(),
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

const Guest = mongoose.model('Guest', guestSchema);
module.exports = Guest;
