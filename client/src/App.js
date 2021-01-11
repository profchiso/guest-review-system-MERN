import { useState } from 'react';
import ReceptionReview from '../src/components/receptionist';
import PoolReview from '../src/components/pool/';
import ResturantReview from '../src/components/resturant';
import logo from '../src/img/BON-hotel-Logo.png';
import { Typography, Button, Image } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';

import store from './store';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import './App.css';
const { Title, Text } = Typography;

function App() {
	const [facilitiesUsed, setFacilitiesUsed] = useState(['reception']);
	const [progressCount, setProgressCount] = useState(1);
	const [reviews, setReviews] = useState([]);
	const [response, setResponse] = useState({});

	return (
		<Provider store={store}>
			<main className='app-container'>
				<div className='content-container'>
					<div>
						<Image src={logo} />
					</div>
					<Title className='title'>Guest Review</Title>
					<Text>
						Please submit a review so we can serve you better
					</Text>
					{progressCount === 1 && (
						<ReceptionReview
							progressCount={progressCount}
							response={response}
							setResponse={setResponse}
							facilitiesUsed={facilitiesUsed}
							setFacilitiesUsed={setFacilitiesUsed}
							reviews={reviews}
							setReviews={setReviews}
						/>
					)}
					{progressCount === 2 && (
						<PoolReview
							progressCount={progressCount}
							response={response}
							setResponse={setResponse}
							facilitiesUsed={facilitiesUsed}
							setFacilitiesUsed={setFacilitiesUsed}
							reviews={reviews}
							setReviews={setReviews}
						/>
					)}
					{progressCount === 3 && (
						<ResturantReview
							progressCount={progressCount}
							response={response}
							setResponse={setResponse}
							facilitiesUsed={facilitiesUsed}
							setFacilitiesUsed={setFacilitiesUsed}
							reviews={reviews}
							setReviews={setReviews}
						/>
					)}

					<div className='previous-next-container'>
						{progressCount === 1 ? null : (
							<Button
								onClick={() =>
									setProgressCount(progressCount - 1)
								}
								className='action-btn'
								type='primary'
								icon={<LeftOutlined />}
								shape='round'></Button>
						)}
						{progressCount >= 3 ? (
							<Button
								className='action-btn'
								type='primary'
								shape='round'>
								Submit
								<RightOutlined />
							</Button>
						) : (
							<Button
								onClick={() =>
									setProgressCount(progressCount + 1)
								}
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
		</Provider>
	);
}

export default App;
