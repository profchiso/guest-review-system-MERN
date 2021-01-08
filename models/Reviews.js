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
	facilitiesUsed: {
		type: String,
		required: true,
	},
	review: [
		{
			facilty: { type: String },
			rating: { type: String },
			moreDescription: { type: String },
		},
	],
});

const Reviews = mongoose.model('Reviews', reviewsSchema);
module.exports = Reviews;
