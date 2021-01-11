import { Typography, Rate, Button } from 'antd';

import './index.css';
import { RightOutlined } from '@ant-design/icons';
const { Text } = Typography;
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

function ReceptionReview() {
	return (
		<div className='component-container'>
			<Text className='question-text'>
				How was the services at reception?
			</Text>
			<div className='rate'>
				<Rate tooltips={desc} allowClear={true} allowHalf={true} />
			</div>
			<Button
				type='primary'
				icon={<RightOutlined />}
				shape='round'></Button>
		</div>
	);
}

export default ReceptionReview;
