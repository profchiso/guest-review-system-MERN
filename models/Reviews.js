const mongoose = require('mongoose');
const reviewsSchema = new mongoose.Schema({
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
	guestName: {
		type: String,
	},
	guestEmail: {
		type: String,
	},
});

const Reviews = mongoose.model('Reviews', reviewsSchema);
module.exports = Reviews;
