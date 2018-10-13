import { h, Component } from 'preact';
import style from './style';
import FixedButton from './../../components/fixedbutton';
import * as Constants from './../../constants';
import { route } from 'preact-router';

class CreateRoom extends Component {
  state = {
    isLoading: true,
    roomId: null
  }

  componentDidMount() {
    fetch(Constants.BASE_URL + Constants.URLS.CREATE_ROOM, {
      method: 'POST'
    })
      .then(res => res.json())
      .then((data) => {
        this.setState(({ isLoading, roomId }) => ({
          isLoading: !isLoading,
          roomId: data.room_id
        }));
        console.log(data);
       
      })
      .catch(console.error);
  }
  startGame = () => {
    const { roomId } = this.state;
    localStorage.setItem("roomId", roomId);
    route('/startgame');
  }
  render() {
    const { isLoading, roomId } = this.state;
    return (
      <div class={style.home}>
        <div class={style.header}>
          <h2>{isLoading ? 'LOADING' : roomId }</h2>
        </div>

        <h3>Share this code</h3>
        <FixedButton label="JOIN ROOM" onClick={this.startGame} />
      </div>
    );
  }
}

export default CreateRoom;