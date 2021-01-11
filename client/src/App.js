import { useState } from 'react';
import ReceptionReview from '../src/components/receptionist';
import { Typography, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import './App.css';
const { Title, Text } = Typography;

function App() {
	const [view, setView] = useState(1);
	const [progressCount, setProgressCount] = useState(1);
	const [response, setResponse] = useState({});
	return (
		<main className='app-container'>
			<div className='content-container'>
				<Title className='title'>Quest Review</Title>
				<Text>Please submit a review so we can serve you better</Text>
				<ReceptionReview />
				<div>
					<Button
						className='action-btn'
						type='primary'
						icon={<RightOutlined />}
						shape='round'></Button>
				</div>
				<div className='progress-count'>1 0f 10</div>
			</div>
		</main>
	);
}

export default App;
