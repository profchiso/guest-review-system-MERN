import { Typography, Rate } from 'antd';
import { connect } from 'react-redux';
import { addFacilityUsed, addServiceReview } from '../../actions';

import './index.css';

const { Text } = Typography;
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

function ReceptionReview(props) {
	return (
		<div className='component-container'>
			<div>
				<Text className='question-text'>
					How was the services at reception?
				</Text>
			</div>
			<div className='rate'>
				<Rate tooltips={desc} allowClear={true} count={5} />
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
