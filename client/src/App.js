import { useState } from 'react';
import ReceptionReview from '../src/components/receptionist';
import PoolReview from '../src/components/pool/';
import ResturantReview from '../src/components/resturant';
import { Typography, Button } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import './App.css';
const { Title, Text } = Typography;

function App() {
	const [view, setView] = useState(1);
	const [progressCount, setProgressCount] = useState(1);

	const [response, setResponse] = useState({});
	console.log(progressCount);
	return (
		<main className='app-container'>
			<div className='content-container'>
				<Title className='title'>Guest Review</Title>
				<Text>Please submit a review so we can serve you better</Text>
				{progressCount === 1 && <ReceptionReview />}
				{progressCount === 2 && <PoolReview />}
				{progressCount === 3 && <ResturantReview />}

				<div className='previous-next-container'>
					{progressCount === 1 ? null : (
						<Button
							onClick={() => setProgressCount(progressCount - 1)}
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

export default App;
