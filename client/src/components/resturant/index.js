import { useState } from 'react';
import { Typography, Rate, Radio } from 'antd';

import './index.css';

const { Text } = Typography;
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

function ResturantReview(props) {
	const {
		progressCount,
		response,
		setResponse,
		facilitiesUsed,
		setFacilitiesUsed,
		reviews,
		setReviews,
	} = props;
	const [questionValue, setQuestionValue] = useState(1);
	const onChange = (e) => {
		setQuestionValue(e.target.value);
	};
	return (
		<div className='component-container'>
			<div>
				<Text className='question-text'>
					Did you use the resturant?
				</Text>
				<div>
					<Radio.Group value={questionValue} onChange={onChange}>
						<Radio value={1}>Yes</Radio>
						<Radio value={2}>No</Radio>
					</Radio.Group>
				</div>
			</div>
			<div className='rate'>
				<Rate tooltips={desc} allowClear={true} count={5} />
			</div>
		</div>
	);
}

export default ResturantReview;
