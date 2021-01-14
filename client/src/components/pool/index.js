import { useState } from 'react';
import { connect } from 'react-redux';
import { Typography, Rate, Radio } from 'antd';
import { updateFacilitiesUsed, addServiceReview } from '../../actions';

import './index.css';

const { Text } = Typography;
const desc = ['Terrible', 'Bad', 'Normal', 'Good', 'Wonderful'];

function PoolReview({ guestReview, updateFacilitiesUsed, addServiceReview }) {
	const { facilitiesUsed, reviews } = guestReview;
	const [questionValue, setQuestionValue] = useState(0);
	const [rating, setRating] = useState(0);
	const handleRatingChange = (value) => {
		setRating(value);
		let poolReview = {
			facilty: 'Pool',
			rating: value > 0 ? `${desc[value - 1]}` : 'No rating',
		};

		let currentReviews = [...reviews];
		let removeReviewIfExist = currentReviews.filter(
			(review) => review.facility !== poolReview.facilty
		);
		let updatedReview = [...removeReviewIfExist, poolReview];
		addServiceReview(updatedReview);
	};
	const onChange = (e) => {
		setQuestionValue(e.target.value);
		if (e.target.value === 1) {
			let facilityUpdate = [...facilitiesUsed, 'Pool'];
			updateFacilitiesUsed(facilityUpdate);
		} else if (e.target.value === 0) {
			let facilityUpdate = [...facilitiesUsed];
			let removeFacility = facilityUpdate.filter(
				(facility) => facility !== 'pool'
			);
			updateFacilitiesUsed(removeFacility);
		}
	};

	return (
		<div className='component-container'>
			<div>
				<Text className='question-text'>Did you use the pool?</Text>
				<div>
					<Radio.Group
						value={questionValue}
						onChange={(e) => onChange(e)}>
						<Radio value={0}>No</Radio>
						<Radio value={1}>Yes</Radio>
					</Radio.Group>
				</div>
			</div>
			{questionValue === 1 && (
				<div className='rate'>
					<Text className='question-text'>Rate this service</Text>
					<div>
						<span>
							<Rate
								allowClear={true}
								count={5}
								value={rating}
								onChange={handleRatingChange}
							/>
							{rating > 0 ? (
								<span className='ant-rate-text'>
									{desc[rating - 1]}
								</span>
							) : (
								''
							)}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
const mapStateToProps = (state) => {
	return {
		...state,
	};
};

export default connect(mapStateToProps, {
	updateFacilitiesUsed,
	addServiceReview,
})(PoolReview);
