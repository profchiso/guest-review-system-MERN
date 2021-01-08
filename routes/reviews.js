const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../controllers/auth');
const {
	getAllReviews,
	getSingleReview,
	addReview,
	editReview,
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
router.post('/', authenticate, addReview);

//edit review
router.patch('/:id', authenticate, editReview);

//delete review by manager

router.delete('/:id', authenticate, authorize(['manager']), deleteReview);

module.exports = router;
