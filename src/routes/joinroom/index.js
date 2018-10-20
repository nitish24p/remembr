import { h, Component } from 'preact';
import style from './style';
import FixedButton from './../../components/fixedbutton';
import * as Constants from './../../constants';
import { route } from 'preact-router';

class JoinRoom extends Component {

  socket = null
  refHandler = input => this.inputRef = input;

  constructor(props) {
    super(props);
    this.state = {
      hasOpponentJoined: false
    };
  }

  joinGame = (event) => {
    event.preventDefault();
    const { currentTarget } = event;
    const code = currentTarget.code.value;
    if (code.length !== 6 ) {
      alert('Incorrect code format');
      return;
    }

    fetch(Constants.BASE_URL + Constants.URLS.JOIN, {
      method: 'post',
      body: JSON.stringify({
        roomId: code
      }),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.status) {
        localStorage.setItem('roomId', code);
        route('/startgame');
      }
      else {
        alert('incorrect code entered');
      }
    });
  }
  render() {
    return (
      <div class={style.home}>
        <div class={style.header}>
          <h2>Enter Room code</h2>
        </div>
        <form onSubmit={this.joinGame}>
          <div class={style.inputContainer}>
            <input type="number" autocomplete={false} required class={style.input} name="code" />
          </div>
          <FixedButton label="JOIN GAME" type="submit" />
        </form>
        
      </div>
    );
  }
}

export default JoinRoom;