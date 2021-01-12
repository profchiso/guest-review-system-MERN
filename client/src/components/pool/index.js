import { useState } from 'react';
import { connect } from 'react-redux';
import { Typography, Rate, Radio } from 'antd';
import { updateFacilitiesUsed, addServiceReview } from '../../actions';

import './index.css';

const { Text } = Typography;
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

function PoolReview({ guestReview, updateFacilitiesUsed, addServiceReview }) {
	const { facilitiesUsed, reviews, response } = guestReview;
	const [questionValue, setQuestionValue] = useState(0);
	const onChange = (e) => {
		console.log(e);
		setQuestionValue(e.target.value);
		if (e.target.value === 1) {
			let facilityUpdate = [...facilitiesUsed, 'pool'];
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
						<Rate tooltips={desc} allowClear={true} count={5} />
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
