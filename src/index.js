import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Dialog from './Dialog';
import Questionnaire from './Questionnaire';
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter as Router } from 'react-router-dom';

const routing = (
	<Router>
		<Route exact path="/" component={App}></Route>
		<Route exact path="/questionnaires" component={Dialog}></Route>
		<Route path="/questionnaires/chat" component={Questionnaire}></Route>
	</Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
