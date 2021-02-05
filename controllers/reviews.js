const { validationResult } = require('express-validator');
const { sendMailWithSendgrid } = require('../util/mailing');

const Review = require('../models/Reviews');

//@get all users restricted to admin users only
exports.getAllReviews = async (req, res) => {
	try {
		const apiError = {};

		let requestQueryObject = { ...req.query }; //make a copy of the req.query object

		let excludedQueryField = ['sort', 'page', 'pageSize', 'fields']; //define keywords in the req.query that should not be considered while querying the database

		excludedQueryField.forEach(
			(element) => delete requestQueryObject[element]
		); //delete any key in the requestQueryObject containing an element in the  excludedQueryField  array

		//advance query using gte,lte,gt,lt
		let queryToString = JSON.stringify(requestQueryObject);
		queryToString = queryToString.replace(
			/\b(gte|lte|gt|lt)\b/g,
			(match) => `$${match}`
		);

		let query = User.find(JSON.parse(queryToString)); // the .select excludes any spacified field before sending the document

		//sorting query result
		if (req.query.sort) {
			// to sort pass the sort param ie ?sort="field1,field2,..." //ascending
			// to sort pass the sort param ie ?sort="-field1,-field2,..." //descending
			const sortBy = req.query.sort.split(',').join(' ');
			query = query.sort(sortBy);
		} else {
			query = query.sort('-createdAt');
		}

		//field limiting
		//pass a parameter called field eg. ?fields=field1,field2,...
		if (req.query.fields) {
			const fields = req.query.fields.split(',').join(' ');
			query = query.select(fields);
		} else {
			query = query.select('-__v ');
		}

		//pagination
		//pass page and pageSize params  eg  ?page=1&pageSize=20

		const page = req.query.page * 1 || 1;
		const pageSize = req.query.pageSize * 1 || 50;
		const skip = (page - 1) * pageSize;
		query = query.skip(skip).limit(pageSize);

		//handle a case where user specify page that does not exists
		if (req.query.page) {
			let numberOfDocument = await User.countDocuments();
			if (skip >= numberOfDocument) {
				apiError.message = 'This page does not exits';
				console.log('apiError', apiError);
				return res.status(404).json(apiError);
			}
		}

		//execute query
		const users = await query; // query.sort().select().skip().limit()
		return res.status(200).json({
			success: true,

			data: {
				users,
			},
		});
	} catch (err) {
		console.log(err);
		return res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};

//@get single user
exports.getSingleReview = async (req, res) => {
	try {
		const apiError = {};
		const user = await User.findById(req.params.id);
		if (!user) {
			apiError.message = `Invalid user id `;
			apiError.success = false;
			console.log('apiError', apiError);
			return res.status(404).json(apiError);
		}

		return res.status(200).json({
			success: true,
			data: {
				user,
			},
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

//@signup user
exports.addReview = async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			message: errors.array(),
		});
	}
	try {
		console.log(req.body)
		const reviewData = { ...req.body };

		const createReview = await Review.create({
			guestName: reviewData.guestName,
			guestEmail: reviewData.guestEmail,
			guestPhone: reviewData.guestPhone,
			comment: reviewData.comment,
			review: reviewData.reviews,
		});

		// const message = `<div>Dear ${createReview.guestName},\n Thank you for using our guest house. \nPlease use the link below to submit a quick review of your over all experience \nhttps://www.guest-review.com/${createReview.id}</div>`;

		// const mailOptions = {
		// 	from: 'giftedbraintech@gmail.com',
		// 	to: createReview.guestEmail,
		// 	subject: 'Thank You for your patronage',
		// 	text: `https://www.guest-review.com/${createReview.id}`,
		// 	html: `${message}`,
		// };

		// await sendMailWithSendgrid(mailOptions);
		return res.status(201).json({
			success: true,
			data: {
				message: `Review submitted`,
				review: createReview,
			},
		});
	} catch (err) {
		console.log(err);
		return res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};

//@update review
exports.updateReview = async (req, res) => {
	try {
		const { facilitiesUsed, review } = req.body;

		const { id } = req.params;
		if (!id) {
			const createReview = await Review.create({
				guestName: 'anonymous',
				guestEmail: 'anonymous',
				guestPhone: 'anonymous',
				facilitiesUsed,
				review,
			});

			return res.status(200).json({
				success: true,
				data: {
					message: `Thank you for the review, We hope to always serve you better`,
					review: createReview,
				},
			});
		}

		const reviewToUpdate = await Review.findById(id);

		if (facilitiesUsed) {
			reviewToUpdate.facilitiesUsed = facilitiesUsed.trim().split(',');
		}
		if (review) {
			reviewToUpdate.review = review;
		}

		await reviewToUpdate.save();
		return res.status(200).json({
			success: true,
			data: {
				message:
					'Your review has been submitted, We hope to always serve you better',
				review: reviewToUpdate,
			},
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};

//@ delete user restricted to admin userTye
exports.deleteReview = async (req, res) => {
	try {
		const { id } = req.params;
		await User.findByIdAndRemove(id);
		return res.status(204).json({
			success: true,
			data: {
				message: `User with the id ${id} has been deleted`,
			},
		});
	} catch (error) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
