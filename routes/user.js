const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { authenticate, authorize } = require('../controllers/auth');
const {
	getAllUsers,
	getSingleUser,
	addUser,
	editUser,
	deleteUser,
} = require('../controllers/user');

//get all Users
router.get(
	'/',
	authenticate,
	authorize(['accountant', 'receptionist', 'manager']),
	getAllUsers
);

//get single user
router.get('/:id', getSingleUser);

//add user
router.post(
	'/',
	[
		check('firstName')
			.not()
			.notEmpty()
			.withMessage('Firtname cannot be empty')
			.escape()
			.trim(),
		check('lastName')
			.not()
			.notEmpty()
			.withMessage('Lastname cannot be empty')
			.escape()
			.trim(),
		check('email')
			.not()
			.notEmpty()
			.withMessage('Email cannot be empty')
			.isEmail()
			.withMessage('Invalid email')
			.normalizeEmail(),
		check('password')
			.not()
			.notEmpty()
			.withMessage('Password must not be empty'),
		check('phone').not().notEmpty().withMessage('phone must not be empty'),
	],
	addUser
);

//edit user
router.patch('/:id', authenticate, editUser);

//delete user by manager

router.delete('/:id', authenticate, authorize(['manager']), deleteUser);

module.exports = router;
