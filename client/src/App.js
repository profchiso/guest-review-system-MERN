import ReceptionReview from '../src/components/receptionist';
import './App.css';

function App() {
	return (
		<main className='app-container'>
			<div></div>
			<div className='content-container'>
				<h4>Quest Review</h4>
				<h5>Please submit a review so we can serve you better</h5>
				<ReceptionReview />
			</div>
		</main>
	);
}

export default App;
