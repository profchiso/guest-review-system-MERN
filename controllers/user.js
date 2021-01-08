const crypto = require('crypto');
const { validationResult } = require('express-validator');
const {
	hashUserPassword,
	decyptPassword,
} = require('../controllers/passwordHashing');
const { generateAccessToken } = require('../controllers/token');
const { sendMail } = require('../util/mailing');

const User = require('../models/User');

//@get all users restricted to admin users only
exports.getAllUsers = async (req, res) => {
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
exports.getSingleUser = async (req, res) => {
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
exports.addUser = async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			message: errors.array(),
		});
	}
	try {
		const { email, password } = req.body;
		const apiError = {};
		const user = await User.findOne({ email });
		if (user) {
			apiError.message = `User with ${email}  already exist!`;
			apiError.success = false;
			return res.status(400).json(apiError);
		}
		if (password !== confirmPassword) {
			apiError.message = 'Password do not match';
			apiError.success = false;
			return res.status(400).json(apiError);
		}

		const userData = { ...req.body };

		let hashedPassword = await hashUserPassword(userData.password);

		const createUser = await User.create({
			firstName: userData.firstName,
			lastName: userData.lastName,
			email: userData.email,
			phone: userData.phone,
			password: hashedPassword,
			userType:
				process.env.ENVIRONMENT === 'test'
					? userData.userType
					: 'staff', // remove on production
		});

		const payLoad = {
			user: {
				id: createUser.id,
			},
		};
		createUser.password = undefined;
		createUser.__v = undefined;

		let accessToken = await generateAccessToken(payLoad);

		const message = `Dear ${createUser.firstName}, your Account has been created successfully`;

		const mailOptions = {
			from: 'giftedbraintech@gmail.com',
			to: createUser.email,
			subject: 'Account created successfully',
			text: `${message}`,
			html: ``,
		};
		res.cookie('accessToken', accessToken, {
			expires: new Date(Date.now() + 24 * 60 * 60 * 1000), //expires in 1days
			httpOnly: true,
			// secure: req.secure || req.headers('x-forwarded-proto') === 'https' //used only in production
		});

		await sendMail(mailOptions);
		return res.status(201).json({
			success: true,
			data: {
				accessToken,
				user: createUser,
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

//@login  regular login
exports.login = async (req, res) => {
	const errors = validationResult(req); // pass req.body for form data validation but for json, just pass req;
	const apiError = {};
	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			message: errors.array(),
		});
	}
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email }).select('+password');

		if (!user) {
			apiError.message = 'Invalid user credentials';
			apiError.success = false;
			return res.status(400).json(apiError);
		}
		if (!user.isActive) {
			apiError.message =
				'Your Account was disabled sometime, please send a reset password request to reactivate your account';
			apiError.success = false;
			return res.status(400).json(apiError);
		}

		if (!(await decyptPassword(password, user.password))) {
			apiError.message = 'Invalid user credentials';
			apiError.success = false;
			return res.status(400).json(apiError);
		}

		const payLoad = {
			user: {
				id: user.id,
			},
		};
		user.password = undefined; //remove the password from what will be sent to the user
		user.__v = undefined;
		user.createdAt = undefined;
		user.userType = undefined;

		let accessToken = await generateAccessToken(payLoad);
		let refreshToken = await generateRefreshToken(payLoad);
		//  to send token as cookie to the browser  use the code below

		res.cookie('accessToken', accessToken, {
			expires: new Date(Date.now() + 24 * 60 * 60 * 1000), //expires in 1days
			httpOnly: true,
			// secure: req.secure || req.headers('x-forwarded-proto') === 'https' //used only in production
		});
		res.cookie('refreshToken', refreshToken, {
			expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //expires in 30days
			httpOnly: true,
			// secure: req.secure || req.headers('x-forwarded-proto') === 'https' //used only in production
		});
		//end of code to send token as cookie

		return res.status(200).json({
			success: true,
			data: {
				accessToken,
				refreshToken,
				user,
			},
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ success: false, message: err.message });
	}
};

//@login with OAuth providers
exports.oAuthLogin = async (req, res) => {
	const errors = validationResult(req); // pass req.body for form data validation but for json, just pass req;

	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			message: errors.array(),
		});
	}

	try {
		const { provider } = req.params;
		const { authProvidersToken } = req.body;
		if (provider === 'google') {
			const userGoogleDetails = await getUserGoogleDetails(
				authProvidersToken
			);
			const { email, name } = userGoogleDetails;
			const user = await User.findOne({ email });
			if (user) {
				const payLoad = {
					user: {
						id: user.id,
					},
				};
				user.password = undefined; //remove the password from what will be sent to the user
				user.__v = undefined;
				user.userType = undefined;

				let accessToken = await generateAccessToken(payLoad);
				let refreshToken = await generateRefreshToken(payLoad);
				//  to send token as cookie to the browser  use the code below
				res.cookie('accessToken', accessToken, {
					expires: new Date(Date.now() + 24 * 60 * 60 * 1000), //expires in 1days
					httpOnly: true,
					// secure: req.secure || req.headers('x-forwarded-proto') === 'https' //used only in production
				});
				res.cookie('refreshToken', refreshToken, {
					expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //expires in 30days
					httpOnly: true,
					// secure: req.secure || req.headers('x-forwarded-proto') === 'https' //used only in production
				});
				//end of code to send token as cookie
				return res.status(200).json({
					success: true,
					data: {
						accessToken,
						refreshToken,
						user,
					},
				});
			} else {
				const createUser = await User.create({
					firstName: name,
					lastName: name,
					email,
					password: email,
					//confirmPassword: email,
				});

				const payLoad = {
					user: {
						id: createUser.id,
					},
				};
				createUser.password = undefined;
				createUser.__v = undefined;
				createUser.userType = undefined;

				let accessToken = await generateAccessToken(payLoad);

				const message = `Dear ${createUser.firstName}, your Account with edeky has been created successfully`;

				const mailOptions = {
					from: 'giftedbraintech@gmail.com',
					to: createUser.email,
					subject: 'Account created successfully',
					text: `${message}`,
					html: ``,
				};
				res.cookie('accessToken', accessToken, {
					expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //expires in 30days
					httpOnly: true,
					// secure: req.secure || req.headers('x-forwarded-proto') === 'https' //used only in production
				});
				//end of code to send token as cookie

				await sendMail(mailOptions);
				return res.status(201).json({
					success: true,
					data: {
						accessToken,
						user: createUser,
					},
				});
			}
		} else if (authProvider === 'facebook') {
			const userFacebookDetails = await getUserFacebookDetails(
				authProvidersToken
			);
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({ success: false, message: err.message });
	}
};

//@forget password
exports.forgotPassword = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			message: errors.array(),
		});
	}

	try {
		const { email } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			apiError.message = `No user with the provided email ${email}`;
			apiError.success = false;
			return res.status(400).json(apiError);
		}

		//get the reset token from the instance middleware in the User model
		const passwordResetToken = user.generatePasswordResetToken();

		//update the user data by setting the passwordResetToken and passwordResetTokenExpires
		await user.save({ validateBeforeSave: false }); // the validate before save option disable all the user model validations

		//generate reset password url
		const resetURL = `https://edeky.netlify.app/forgot-password/${passwordResetToken}`;

		const message = `Forgot your password?, reset your password here ${resetURL}. \n please if you did not request for password reset, ignore this message`;

		//send the reset password mail
		try {
			const mailOptions = {
				from: 'giftedbraintech@gmail.com',
				to: email,
				subject: 'Password reset token (last for 30 minutes)',
				text: `Dear ${user.firstName}, ${message}`,
				html: ``,
			};

			await sendMail(mailOptions);
			return res.status(200).json({
				success: true,
				data: {
					message: `A password reset token has ben sent to your email address  ${user.email}`,
					passwordResetToken,
				},
			});
		} catch (err) {
			console.log(err);
			//if the is an error while sending resettoken mail, set both passwordResetToken ,passwordResetTokenExpires to undefined and save
			user.passwordResetToken = undefined;
			user.passwordResetTokenExpires = undefined;
			await user.save({ validateBeforeSave: false });
			return res.status(500).json({
				success: false,
				message:
					'There was an error sending the email please try again later',
			});
		}
	} catch (err) {
		console.log(err);
		return res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};

//@resetPassword
exports.resetPassword = async (req, res) => {
	try {
		//get user base on the reset password token sent to their mail
		const { passwordResetToken } = req.params;
		const apiError = {};

		const errors = validationResult(req); // pass req.body for form data validation but for json, just pass req;

		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				message: errors.array(),
			});
		}
		const { password, confirmPassword } = req.body;
		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message: 'Password does not match',
			});
		}

		const hashedToken = crypto
			.createHash('sha256')
			.update(passwordResetToken)
			.digest('hex');

		//check if there is user with the hashedtoken and also if the token has not expired
		const user = await User.findOne({
			passwordResetToken: hashedToken,
			passwordResetTokenExpires: { $gt: Date.now() },
		}).select('+password +passwordResetToken +passwordResetTokenExpires');
		//if no user is found
		if (!user) {
			apiError.message = `Token invalid or has expires try generating new token by entering your email again`;
			apiError.success = false;
			return res.status(400).json(apiError);
		}
		//update user data and save
		user.password = await hashUserPassword(password);
		user.passwordResetToken = undefined;
		user.passwordResetTokenExpires = undefined;
		await user.save();

		//log user in by assigning hin a token
		const payLoad = {
			user: {
				id: user.id,
			},
		};
		let accessToken = await generateAccessToken(payLoad);
		//  to send token as cookie to the browser  use the code below
		res.cookie('accessToken', accessToken, {
			expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //expires in 30days
			httpOnly: true,
			// secure: req.secure || req.headers('x-forwarded-proto') === 'https' //used only in production
		});

		return res.status(200).json({
			success: true,
			data: {
				accessToken,
				user,
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

//@update user password
exports.updatePassword = async (req, res) => {
	const errors = validationResult(req); // pass req.body for form data validation but for json, just pass req;
	const apiError = {};
	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			message: errors.array(),
		});
	}
	//get the submitted password
	const { oldPassword, newPassword, newConfirmPassword } = req.body;

	try {
		//get the user from the user collection
		let user = await User.findById(req.user.id).select(
			'+password +confirmPassword'
		);
		if (!user) {
			apiError.message = `User not found`;
			apiError.success = false;
			return res.status(404).json(apiError);
		}

		// check if passwaord matches the one in the database

		let passwordIsMatch = await user.isMatchPassword(
			oldPassword,
			user.password
		);
		if (!passwordIsMatch) {
			apiError.message = `The password you entered is incorrect`;
			apiError.success = false;
			return res.status(401).json(apiError);
		}
		if (newPassword !== newConfirmPassword) {
			apiError.message = `Password do not match`;
			apiError.success = false;
			return res.status(400).json(apiError);
		}
		user.password = await hashUserPassword(newPassword);
		//user.confirmPassword = newConfirmPassword;
		await user.save();

		// always use the save for password update and not findbyidandupdate in order to run the User model pre middlewares

		//log user in by assigning him a token
		const payLoad = {
			user: {
				id: user.id,
			},
		};
		let accessToken = await generateAccessToken(payLoad);
		//  to send token as cookie to the browser  use the code below

		res.cookie('accessToken', accessToken, {
			expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //expires in 30days
			httpOnly: true,
			// secure: req.secure || req.headers('x-forwarded-proto') === 'https' //used only in production
		});
		//end of code to send token as cookie

		return res.status(200).json({
			success: true,
			data: {
				accessToken,
				user,
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

//@update user info
exports.updateMe = async (req, res) => {
	try {
		const { password, confirmPassword, userType, createdAt } = req.body;
		const apiError = {};
		if (password || confirmPassword || userType || createdAt) {
			apiError.message = `You cannot update password  or confirm password from this route`;
			apiError.success = false;
			return res.status(400).json(apiError);
		}

		let updatedata = { ...req.body };
		const excludedFields = [
			'password',
			'confirmPassword',
			'userType',
			'createdAt',
			'passwordResetToken',
			'passwordResetTokenExpires',
		];

		excludedFields.forEach((field) => delete updatedata[field]); //exclude the password,confirmpassword,user field  etc from update data
		updatedata.isActive = true;
		const user = await User.findByIdAndUpdate(req.user.id, updatedata, {
			new: true,
			runValidators: true,
		});
		return res.status(200).json({
			success: true,
			data: {
				user,
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
exports.deleteUser = async (req, res) => {
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
