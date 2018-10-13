import { h, Component } from 'preact';
import { Router } from 'preact-router';

// import Header from './header';

// Code-splitting is automated for routes
import Game from '../routes/game';
import Score from '../routes/score';
import CreateRoom from '../routes/createroom';
import Home from './../routes/home';

export default class App extends Component {
	
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<div id="app">
				{/* <Header /> */}
				<Router onChange={this.handleRoute}>
          <Home path="/" />
          <Game path="/game" />
          <Score path="/score" />
          <CreateRoom path="/create" />
				</Router>
			</div>
		);
	}
}
