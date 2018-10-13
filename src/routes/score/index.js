import { h, Component } from 'preact';
import style from './style';
import { route } from 'preact-router';
import FixedButton from './../../components/fixedbutton';

export default class Score extends Component {
  score = 0;
	constructor(props) {
    super(props);
    this.score = localStorage.getItem('score');
    if (!this.score) {
      this.gotoGame();
    }
    else {
      localStorage.clear();
    }
  }
  renderEmoji() {
    if (this.score <= 60) {
      return  '😎';
    }
    else if (this.score <= 80) {
      return '😏';
    }
    else if (this.score <= 100) {
      return '😑';
    }
    else if (this.score <= 150) {
      return '🤒';
    }
    else if (this.score > 150) {
      return '💩';
    }
  }

  gotoGame = () => {
    route('/game', true);
  }

	// Note: `user` comes from the URL, courtesy of our router
	render() {
		return (
			<div class={style.score}>
        <div class={style.container}>
          <h2>Time taken</h2>
          <h1>{this.score} seconds</h1>
          <span class={style.emoji}>
            {this.renderEmoji()}
          </span>
          
        </div>
        <FixedButton label="START OVER" onClick={this.gotoGame} />
			</div>
		);
	}
}
