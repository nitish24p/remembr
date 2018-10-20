import { h, Component } from 'preact';
import style from './style';
import image from './../../assets/logo.png';
import FixedButton from './../../components/fixedbutton';
import Button from './../../components/button';
import ButtonGroup from './../../components/button/buttongroup';
import { route } from 'preact-router';

class Home extends Component {
  startSoloGame() {
    route('/game');
  }
  startCreateGame() {
    route('/create');
  }
  joinGame() {
    route('/join');
  }
  render() {
    return (
      <div class={style.home}>
        <div class={style.header}>
          <h1>REMEMBR</h1>
          <img src={image} alt="logo url" />
        </div>
        <ButtonGroup>
          <Button label="CREATE GAME" primary onClick={this.startCreateGame} />
          <Button label="JOIN GAME" secondary onClick={this.joinGame} />
          <Button label="PLAY SOLO" tertiary onClick={this.startSoloGame} />
        </ButtonGroup>
      </div>
    );
  }
}

export default Home;