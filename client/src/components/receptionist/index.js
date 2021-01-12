import { useState } from 'react';
import { Typography, Rate } from 'antd';
import { connect } from 'react-redux';
import { addFacilityUsed, addServiceReview } from '../../actions';

import './index.css';

const { Text } = Typography;
const desc = ['Terrible', 'Bad', 'Normal', 'Good', 'Wonderful'];

function ReceptionReview(props) {
	const [receptionRating, setReceptionRating] = useState(1);
	const handleRatingChange = (value) => {
		setReceptionRating(value);
	};
	console.log(receptionRating);
	return (
		<div className='component-container'>
			<div>
				<Text className='question-text'>
					How was the services at reception?
				</Text>
			</div>
			<div className='rate'>
				<span>
					<Rate
						allowClear={true}
						count={5}
						value={receptionRating}
						onChange={handleRatingChange}
					/>
					{receptionRating ? (
						<span className='ant-rate-text'>
							{desc[receptionRating - 1]}
						</span>
					) : (
						''
					)}
				</span>
			</div>
		</div>
	);
}
const mapStateToProps = (state) => {
	return {
		...state,
	};
};

export default connect(mapStateToProps, {})(ReceptionReview);
