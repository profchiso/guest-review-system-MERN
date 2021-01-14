import { useState } from 'react';
import ReceptionReview from '../receptionist';
import PoolReview from '../pool';
import ResturantReview from '../resturant';
import logo from '../../img/BON-hotel-Logo.png';
import { Typography, Button, Image, message } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import { updateFacilitiesUsed, addServiceReview } from '../../actions';
import { connect } from 'react-redux';
import axios from 'axios';

import '../../App.css';
const { Title, Text } = Typography;

function Landing({ guestReview }) {
	const { reviews, facilitiesUsed } = guestReview;
	const [isLoading, setIsLoading] = useState(false);

	const [progressCount, setProgressCount] = useState(1);
	const submitReview = async (reviewDetails) => {
		setIsLoading(!isLoading);
		const body = JSON.stringify(reviewDetails);
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
			accept: 'application/json',
		};
		try {
			// const res = await axios.patch('/api/v1/review', body, config);
			// console.log(res.data);
			console.log(reviewDetails);

			setTimeout(() => {
				message.success('Review submitted successfully');
				setIsLoading(false);
			}, 2000);
		} catch (error) {
			console.log(error);
		}
	};
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
							onClick={() =>
								submitReview({ reviews, facilitiesUsed })
							}
							loading={isLoading}
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
