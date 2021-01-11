import { Typography, Rate, Button } from 'antd';

import './index.css';

const { Text } = Typography;
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

function ReceptionReview() {
	return (
		<div className='component-container'>
			<Text className='question-text'>
				How was the services at reception?
			</Text>
			<div className='rate'>
				<Rate tooltips={desc} allowClear={true} count={5} />
			</div>
		</div>
	);
}

export default ReceptionReview;
