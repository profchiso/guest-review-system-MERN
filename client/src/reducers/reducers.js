const initialState = {
	facilitiesUsed: ['Reception'],
	reviews: [],
};

export const guestReview = (state = initialState, actions) => {
	const { type, payload } = actions;
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
