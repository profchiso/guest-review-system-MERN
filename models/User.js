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
	userType: {
		type: String,
		default: 'staff',
		enum: ['staff', 'accountant', 'receptionist', 'manager'],
	},
});

const User = mongoose.model('User', userSchema);
module.exports = User;
