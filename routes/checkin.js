const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../controllers/auth');
const {
	getAllCheckIn,
	getSingleCheckIn,
	addCheckIn,
	editCheckIn,
	deleteCheckIn,
} = require('../controllers/checkIn');

//get all checkin
router.get(
	'/',
	authenticate,
	authorize(['accountant', 'receptionist', 'manager']),
	getAllCheckIn
);

//get single checkin
router.get('/:id', getSingleCheckIn);

//add checkin
router.post('/', authenticate, addCheckIn);

//edit checkin
router.patch('/:id', authenticate, editCheckIn);

//delete checkin by manager

router.delete('/:id', authenticate, authorize(['manager']), deleteCheckIn);

module.exports = router;
