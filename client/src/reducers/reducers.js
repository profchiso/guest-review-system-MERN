const initialState = {
	facilitiesUsed: ['reception'],
	reviews: [],
	response: {},
};

export const guestReview = (state = initialState, actions) => {
	const { type, payload } = actions;
	// console.log('action type', type);
	// console.log('action payload', payload);

	if (type === 'ADD_SERVICE_REVIEW') {
		return {
			...state,
			reviews: payload,
		};
	} else if (type === 'ADD_FACITITY_USED') {
		return {
			...state,
			facilitiesUsed: payload,
		};
	}
	return state;
};
