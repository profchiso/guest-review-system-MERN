const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { authenticate, authorize } = require('../controllers/auth');
const {
	getAllReviews,
	getSingleReview,
	addReview,
	updateReview,
	deleteReview,
} = require('../controllers/reviews');

//get all Reviews
router.get(
	'/',
	authenticate,
	authorize(['accountant', 'receptionist', 'manager']),
	getAllReviews
);

//get single Review
router.get('/:id', getSingleReview);

//add review
router.post(
	'/',
	// [
	// 	check('guestName')
	// 		.not()
	// 		.notEmpty()
	// 		.withMessage('Firtname cannot be empty')
	// 		.escape()
	// 		.trim(),
	// 	check('guestEmail')
	// 		.not()
	// 		.notEmpty()
	// 		.withMessage('Lastname cannot be empty')
	// 		.isEmail()
	// 		.withMessage('Invalid email')
	// 		.normalizeEmail(),
	// 	check('guestPhone')
	// 		.not()
	// 		.notEmpty()
	// 		.withMessage('Phone number required'),
	// ],
	addReview
);

//edit review
router.patch('/:id', updateReview);

//delete review by manager

router.delete('/:id', authenticate, authorize(['manager']), deleteReview);

module.exports = router;
