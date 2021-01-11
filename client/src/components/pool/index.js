import { Typography, Rate } from 'antd';

import './index.css';

const { Text } = Typography;
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

function PoolReview() {
	return (
		<div className='component-container'>
			<Text className='question-text'>Did you use the pool?</Text>
			<div className='rate'>
				<Rate tooltips={desc} allowClear={true} count={5} />
			</div>
		</div>
	);
}

export default PoolReview;
