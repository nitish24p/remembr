import { h, Component } from 'preact';
import style from './style';
import FixedButton from './../../components/fixedbutton';
import * as Constants from './../../constants';
import { route } from 'preact-router';
import io from 'socket.io-client';
import Cell from './../../components/cell';
import Row from './../../components/row';
import { getFontSize } from './../../utils';

class Multiplayer extends Component {
  
  socket = null;
  alias = +new Date().getTime()
  roomId;
  clickedCards = []
  level;

  constructor(props) {
    super(props);
    this.state = {
      hasOpponentJoined: false,
      gameStarted: false,
      isOwner: false,
      gridBoard: undefined,
      disableClick: false,
      myScore: 0,
      opponentScore: 0,
      peakUsed: false,
      gameEnded: false
    };

    this.setUpSocketListeners();
  }

  setUpSocketListeners = () => {
    const roomId = localStorage.getItem('roomId');
    this.roomId = roomId;

    if (!roomId) {
      route('/create');
      return;
    }

    this.socket = io(Constants.BASE_URL);
    /**
     * Join socket room
     */
    this.socket.on('connect', (socket) => {
      this.alias = this.socket.id;
      console.log('socket', this.socket.id, this.socket);
      // this.socket.emit(Constants.SOCKET_EVENTS.room, { roomId, alias: this.alias });

      this.socket.emit(Constants.SOCKET_EVENTS.room, { roomId, alias: this.alias });
    });

    this.socket.on('joint', data => {
      let isOwner = false;
      const hasOpponentJoined = data.players.some(player => player.id !== this.alias);
      const playerSocket = data.players.find(player => player.id === this.alias);

      if (playerSocket.isOwner) {
        isOwner = true;
      }
      this.setState({ hasOpponentJoined, isOwner });
    });

    this.socket.on('game started', data => {
      const { board, gameStarted } = data;
      this.setState({ gridBoard: board, gameStarted, level: data.level, gameEnded: false });
    });

    this.socket.on('level updated', data => {
      const { board, gameStarted } = data;
      this.setState({ gridBoard: board, gameStarted, level: data.level, disableClick: false });
    });

    this.socket.on('score updated', data => {
      const { players } = data;
      let { myScore, opponentScore } = this.state;
      players.forEach(player => {
        if (player.id === this.alias) {
          myScore = player.score;
        }
        else {
          opponentScore = player.score;
        }
      });

      this.setState({ myScore, opponentScore });
    });

    this.socket.on('game completed', data => {
      //const { players } = data
      this.setState({
        gameEnded: true
      });
    })

    this.socket.on('user left', data => {
      alert('Opponent Left');
      localStorage.clear('roomId');
      route('/', true);
    });

    this.socket.on('connect_error', (error) => {
      console.log(error);
    });

    this.socket.on('reconnect', (error) => {
      console.log(error);
    });

    this.socket.on('update', (data) => {
      const { gridBoard } = this.state;
      const { cards } = data;
      cards.forEach(card => {
        gridBoard[card.rowIndex][card.columnIndex] = card;
      });
      this.setState({ gridBoard });
    });


    //this.socket.on()
  }

  componentWillUnmount() {
    this.socket.close();
  }

  startGame = () => {
    // LOL
    const { isOwner } = this.state;
    if (!isOwner) {
      alert('only an owner can start the game');
      return;
    }
    this.socket.emit(Constants.SOCKET_EVENTS.start, {
      roomId: this.roomId
    });
    
  }

  openCard = (event) => {
    event.stopPropagation();
    if (this.clickedCards.length === 2) {
      return ;
    }

    const { gridBoard } = this.state;
    const { currentTarget } = event;
    const columnIndex = currentTarget.getAttribute('data-columnindex');
    const rowIndex = currentTarget.getAttribute('data-rowindex');
    const selectedCell = gridBoard[rowIndex][columnIndex];
    if (selectedCell.isMatched) return;

    if (selectedCell.isOpen) {
      selectedCell.isOpen = false;
    }
      else {
      selectedCell.isOpen = true;
    }
    gridBoard[rowIndex][columnIndex] = selectedCell;
    this.clickedCards.push(selectedCell);
    this.setState({ gridBoard }, () => {
      if (this.clickedCards.length === 2) {
        setTimeout(() => {
          this.checkIfCardsAreMatched();
        }, 1200);
      }


    });

  }

  checkIfCardsAreMatched = () => {
    let tempCell = null;

    if (this.clickedCards.length !== 2) {
      return;
    }

    this.setState({ disableClick: true }, () => {
      const { gridBoard } = this.state;
      let didCardsMatch = false;
      this.clickedCards.forEach(card => {
        //debugger;
        gridBoard[card.rowIndex][card.columnIndex].isOpen = false;
        if (!tempCell) {
          tempCell = card;
        }
        else if (tempCell.value === card.value &&
          ((tempCell.rowIndex !== card.rowIndex) ||
          (tempCell.columnIndex !== card.columnIndex))) {
          gridBoard[tempCell.rowIndex][tempCell.columnIndex].isMatched = true;
          gridBoard[card.rowIndex][card.columnIndex].isMatched = true;
          didCardsMatch = true;
        }
      });
      this.setState({ gridBoard, disableClick: false }, () => {
        
        if (didCardsMatch) {
          this.socket.emit('match', { clickedCards: this.clickedCards,
            roomId: this.roomId, level: this.state.level });
          this.isGameOver();
        }
        this.clickedCards = [];
        
      });
    });


  }

  isGameOver = () => {
    const { gridBoard, level } = this.state;
    const isGameOver = gridBoard.every(cardRow => cardRow.every(card => card.isMatched));
    if (isGameOver) {
      if (level < 3) {
        this.socket.emit('level up', {
          roomId: this.roomId
        });
        this.setState({
          disableClick: true
        });
      }
      else {
        this.socket.emit('game over', {
          roomId: this.roomId
        });
      }
    }
  }

  revealAll = () => {
    if (this.state.peakUsed) {
      return;
    }
    let gridBoard = this.revealCards(true);

    this.setState({ gridBoard, peakUsed: true }, () => {
      setTimeout(() => {
        gridBoard = this.revealCards(false);
        this.setState({ gridBoard });
      }, 3000);
    });
  }

  revealCards = (state) => {
    let { gridBoard } = this.state;
    gridBoard = gridBoard.map(rows => rows.map(cell => {
      cell.isOpen = state;
      return cell;
    }));

    return gridBoard;
  }

  renderScores = () => {
    const { myScore, opponentScore } = this.state;
    return (
      <div class={style.scorecontainer}>
        <span class={myScore > opponentScore ? style.leader : ''}>Your Score: {myScore}</span>
        <span class={myScore < opponentScore ? style.leader: ''}>Opponent Score: {opponentScore}</span>
      </div>
    );
  }

  renderGridBoard = () => {
    const { gridBoard, disableClick } = this.state;
    return gridBoard.map((row, index) =>
      <Row disableClick={disableClick} openCard={this.openCard} row={row} rowIndex={index} />);
  }
  goHome = () => {
    localStorage.clear('roomId');
    route('/', true);
  }
  render() {
    const {
      isLoading,
      roomId,
      hasOpponentJoined,
      gridBoard,
      level,
      gameStarted,
      gameEnded,
      myScore,
      opponentScore
    } = this.state;

    if (gameEnded) {
      return (
        <div class={style.multi}>
          <div class={style.header}>
            <h1>Game Over</h1>
            <h1>{myScore > opponentScore ? 'You Won' : 'You Lost'}</h1>
            <h1>{myScore > opponentScore ? '😎': '💩'}</h1>
            <h1>{myScore}</h1>
          </div>
          <FixedButton disabled={!hasOpponentJoined} label="GO HOME" onClick={this.goHome} />
        </div>
        
      );
    }

    return (
      <div class={style.multi}>
        <div class={style.header}>
          <h2>{!hasOpponentJoined ? 'WAITING FOR OPPONENT' : null}</h2>
        </div>
        {gameStarted ? this.renderScores(): null}
        {!gridBoard ?
          <FixedButton disabled={!hasOpponentJoined} label="START GAME" onClick={this.startGame} /> :
            <div>
              <div className={style.game} style={{ fontSize: getFontSize(level) }}>
                {this.renderGridBoard()}
              </div>

              <div class={style.buttonContainer}>
                <button disabled={this.state.peakUsed} onClick={this.revealAll}
                  class={`${style.button} ${style.bluebtn}`}
                >Peak</button>
              </div>
            </div>
           }
      </div>
    );
  }
}

export default Multiplayer;