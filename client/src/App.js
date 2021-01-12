import { useState } from 'react';
import Landing from '../src/components/landing';
import store from './store';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import './App.css';

function App() {
	return (
		<Provider store={store}>
			<Router>
				<Switch>
					<Route exact path='/' component={Landing} />
					<Route exact path='/:id' component={Landing} />
				</Switch>
			</Router>
		</Provider>
	);
}

export default App;
