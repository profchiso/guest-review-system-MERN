import { useState } from 'react';
import ReceptionReview from '../receptionist';
import PoolReview from '../pool';
import ResturantReview from '../resturant';
import logo from '../../img/BON-hotel-Logo.png';
import { Typography, Button, Image } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import { updateFacilitiesUsed, addServiceReview } from '../../actions';
import { connect } from 'react-redux';

import '../../App.css';
const { Title, Text } = Typography;

function Landing({ guestReview }) {
	const { facilitiesUsed, reviews, response } = guestReview;

	console.log(guestReview);
	const [progressCount, setProgressCount] = useState(1);
	return (
		<main className='app-container'>
			<div className='content-container'>
				<div>
					<Image src={logo} />
				</div>
				<Title className='title'>Guest Review</Title>
				<Text>Please submit a review so we can serve you better</Text>
				{progressCount === 1 && <ReceptionReview />}
				{progressCount === 2 && <PoolReview />}
				{progressCount === 3 && <ResturantReview />}
				{progressCount > 3 && (
					<div className='rate'>
						<Text className='question-text'>
							Reviews captured, click submit to send you review
						</Text>
					</div>
				)}

				<div className='previous-next-container'>
					{progressCount === 1 || progressCount > 3 ? null : (
						<Button
							onClick={() => setProgressCount(progressCount - 1)}
							className='action-btn'
							type='primary'
							icon={<LeftOutlined />}
							shape='round'></Button>
					)}
					{progressCount > 3 ? (
						<Button
							className='action-btn'
							type='primary'
							shape='round'>
							Submit
							<RightOutlined />
						</Button>
					) : (
						<Button
							onClick={() => setProgressCount(progressCount + 1)}
							className='action-btn'
							type='primary'
							icon={<RightOutlined />}
							shape='round'></Button>
					)}
				</div>
				<div className='progress-count'>
					{progressCount > 3 ? 3 : progressCount} 0f 3
				</div>
			</div>
		</main>
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
})(Landing);
