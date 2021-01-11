import { useState } from 'react';
import { connect } from 'react-redux';
import { Typography, Rate, Radio } from 'antd';
import { addFacilityUsed, addServiceReview } from '../../actions';

import './index.css';

const { Text } = Typography;
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

function PoolReview({ addFacilityUsed, addServiceReview }) {
	const [questionValue, setQuestionValue] = useState(0);
	const onChange = (e) => {
		setQuestionValue(e.target.value);
		if (questionValue === 1) {
			addFacilityUsed('pool');
		} else if (questionValue === 0) {
		}
	};

	return (
		<div className='component-container'>
			<div>
				<Text className='question-text'>Did you use the pool?</Text>
				<div>
					<Radio.Group value={questionValue} onChange={onChange}>
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

export default connect(mapStateToProps, { addFacilityUsed, addServiceReview })(
	PoolReview
);
