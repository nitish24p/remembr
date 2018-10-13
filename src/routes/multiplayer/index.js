import { h, Component } from 'preact';
import style from './style';
import FixedButton from './../../components/fixedbutton';
import * as Constants from './../../constants';
import { route } from 'preact-router';
import io from 'socket.io-client';

class Multiplayer extends Component {
  
  socket = null;
  alias = +new Date().getTime()

  constructor(props) {
    super(props);
    this.state = {
      hasOpponentJoined: false
    };

    this.setUpSocketListeners();
  }

  setUpSocketListeners = () => {
    const roomId = localStorage.getItem('roomId');

    if (!roomId) {
      route('/create');
    }

    this.socket = io(Constants.BASE_URL);
    /**
     * Join socket room
     */
    console.log('hello', this.socket.id);
    this.socket.on('connect', (socket) => {
      console.log('socket', this.socket.id, this.socket);
      // this.socket.emit(Constants.SOCKET_EVENTS.room, { roomId, alias: this.alias });

      this.socket.emit(Constants.SOCKET_EVENTS.room, { roomId, alias: this.alias });
    });

    this.socket.on('joint', data => {
      console.log('someone joined', data);
    });

    this.socket.on('user left', data => {
      console.log('someone left', data);
    });

    this.socket.on('connect_error', (error) => {
      console.log(error);
    });

    this.socket.on('reconnect', (error) => {
      console.log(error);
    });


    //this.socket.on()
  }

  componentWillUnmount() {
    this.socket.close();
  }

  startGame() {
    // LOL
   console.log("PUSH MESSAGE TO SERVER TO START");
  }
  render() {
    const { isLoading, roomId, hasOpponentJoined } = this.state;
    return (
      <div class={style.home}>
        <div class={style.header}>
          <h2>{!hasOpponentJoined ? 'WAITING FOR OPPONENT' : null}</h2>
        </div>

        <h3>Can give a list of users here</h3>
        <FixedButton disabled={!hasOpponentJoined} label="START GAME" onClick={this.startGame} />
      </div>
    );
  }
}

export default Multiplayer;