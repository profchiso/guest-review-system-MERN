const mongoose = require('mongoose');
const reviewsSchema = new mongoose.Schema({
	guestName: {
		type: String,
	},
	guestEmail: {
		type: String,
	},
	guestPhone: {
		type: String,
	},
	facilitiesUsed: [String],
	review: [
		{
			facilty: { type: String },
			rating: { type: String },
			moreDescription: { type: String },
		},
	],
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

const Reviews = mongoose.model('Reviews', reviewsSchema);
module.exports = Reviews;
