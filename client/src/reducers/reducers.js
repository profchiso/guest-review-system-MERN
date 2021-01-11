const initialState = {
	facilitiesUsed: ['reception'],
	reviews: [],
	response: {},
};

export const guestReview = (state = initialState, actions) => {
	const { type, payload } = actions;
	console.log('action type', type);
	console.log('action payload', payload);

	if (
		type === 'SAVE_REGISTERED_USER_DATA' ||
		type === 'SAVE_LOGGED_IN_USER_DATA'
	) {
		localStorage.setItem('token', JSON.stringify(payload.token));
		localStorage.setItem('user', JSON.stringify(payload.user));
		return {
			...state,
			token: payload.token,
			user: payload.user,
			isSuccessful: true,
			error: {},
		};
	} else if (type === 'REGISTRATION_ERROR' || type === 'LOGIN_ERROR') {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		return {
			...state,
			error: payload,
			isSuccessful: false,
		};
	} else if (type === 'LOGOUT') {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		return {
			...state,
			user: {},
			isSuccessful: false,
			token: '',
		};
	} else if (type === 'SET_PASSWORD_RESET_RESPONSE') {
		return {
			...state,
			passwordResetResponse: payload,
		};
	} else if (type === 'CLEAR_ERROR_MESSAGE') {
		return {
			...state,
			error: {},
			passwordResetResponse: {},
		};
	}

	return state;
};
