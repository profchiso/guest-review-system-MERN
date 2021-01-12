export const addServiceReview = (serviceReview) => {
	return {
		type: 'ADD_SERVICE_REVIEW',
		payload: serviceReview,
	};
};

export const updateFacilitiesUsed = (facility) => {
	return {
		type: 'ADD_FACITITY_USED',
		payload: facility,
	};
};
