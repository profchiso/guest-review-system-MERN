const initialState = {
	facilitiesUsed: ['reception'],
	reviews: [],
	response: {},
};

export const guestReview = (state = initialState, actions) => {
	const { type, payload } = actions;
	console.log('action type', type);
	console.log('action payload', payload);
	console.log('present state', state);

	if (type === 'ADD_SERVICE_REVIEW') {
		let reviewsWithoutPresentService = state.reviews.filter(
			(review) => review.facility !== payload.facility
		);
		reviewsWithoutPresentService.push(payload);

		return {
			...state,
			reviews: reviewsWithoutPresentService,
		};
	} else if (type === 'ADD_FACITITY_USED') {
		return {
			...state,
			facilitiesUsed: payload,
		};
	}
	return state;
};
