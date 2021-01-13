const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
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
	userType: {
		type: String,
		default: 'staff',
		enum: ['staff', 'accountant', 'receptionist', 'manager'],
	},
	password: {
		type: String,
		required: true,
	},
});

const User = mongoose.model('User', userSchema);
module.exports = User;
