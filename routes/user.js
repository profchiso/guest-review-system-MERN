const express = require('express');
const router = express.Router();
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
router.post('/', authenticate, addUser);

//edit user
router.patch('/:id', authenticate, editUser);

//delete user by manager

router.delete('/:id', authenticate, authorize(['manager']), deleteUser);

module.exports = router;
