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
	comment: String,
	facility:{
		type:String,
		enum:["RATE YOUR STAY","DINING", "CONFERENCE"]
	},
	reviews: [
		{
			question: { type: String },
			rateValue: { type: Number },
		},
	],
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

const Reviews = mongoose.model('Reviews', reviewsSchema);
module.exports = Reviews;
