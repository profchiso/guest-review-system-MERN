const bcrypt = require('bcryptjs');
exports.hashUserPassword = async (password) => {
	try {
		const saltRound = await bcrypt.genSalt(10);
		let hashedPassword = await bcrypt.hash(password, saltRound);
		return hashedPassword;
	} catch (error) {
		console.log(error);
	}
};

exports.decyptPassword = async (enteredPassword, hashedPassword) => {
	try {
		return await bcrypt.compare(enteredPassword, hashedPassword);
	} catch (error) {
		console.log(error);
	}
};

exports.isMatchPassword = async (enteredPassword, userpassword) => {
	try {
		return await bcrypt.compare(enteredPassword, userpassword);
	} catch (error) {
		console.log(error);
	}
};
