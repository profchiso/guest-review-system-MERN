const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
exports.generateAccessToken = async (payload) => {
	try {
		let accessToken = jwt.sign(payload, JWT_SECRET, {
			expiresIn: '90 days',
		});
		return accessToken;
	} catch (error) {
		console.log(error);
	}
};
