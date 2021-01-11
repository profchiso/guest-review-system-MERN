import { useState } from 'react';
import ReceptionReview from '../src/components/receptionist';
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
				<Title className='title'>Quest Review</Title>
				<Text>Please submit a review so we can serve you better</Text>
				<ReceptionReview />
				<div className='previous-next-container'>
					{progressCount === 1 || progressCount === 11 ? null : (
						<Button
							onClick={() => setProgressCount(progressCount - 1)}
							className='action-btn'
							type='primary'
							icon={<LeftOutlined />}
							shape='round'></Button>
					)}
					{progressCount === 11 ? (
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
					{progressCount > 10 ? 10 : progressCount} 0f 10
				</div>
			</div>
		</main>
	);
}

export default App;
