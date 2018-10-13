import { h, Component } from 'preact';
import style from './style';
import image from './../../assets/logo.png';
import FixedButton from './../../components/fixedbutton';
import { route } from 'preact-router';

class Home extends Component {
  startGame() {
    route('/game');
  }
  render() {
    return (
      <div class={style.home}>
        <div class={style.header}>
          <h1>REMEMBR</h1>
          <img src={image} alt="logo url" />
        </div>
        
        <h3>Find matching pairs of numbers</h3>
        <ul class={style.ul}>
          <li><div class={`${style.square} ${style.blue}`} />
            <span class={style.listText}>Peak Bonus: See all cards for a brief period of time</span>
          </li>
          <li><div class={`${style.square} ${style.orange}`} />
            <span class={style.listText}>Even Match: Match all even number cards</span>
          </li>
          <li><div class={`${style.square} ${style.green}`} />
            <span class={style.listText}>Odd Match: Match all odd number cards</span>
          </li>
        </ul>
        <FixedButton label="START" onClick={this.startGame} />
      </div>
    );
  }
}

export default Home;