import { h, Component } from 'preact';
import style from './style';
import { route } from 'preact-router';

const Cell = (props) => {
  const { cell, disableClick }= props;
  return (
    <button className={`${style.cell} ${cell.isOpen ? style.open : ''} 
      ${cell.isMatched ? style.match : ''}
      `}
      disabled={disableClick}
      data-rowindex={props.rowIndex}
      data-columnindex={props.columnIndex}
      onClick={props.openCard}
    >
      <span>{cell.value}</span>
    </button>
  );
};

const Row = (props) => {
  const { rowIndex, row, nextPlayer, openCard, disableClick } = props;
  const generateCells = row.map((rowItem, columnIndex) => {
    return (
      <Cell
        disableClick={disableClick}
        key={`${rowIndex}-${columnIndex}`}
        cell={rowItem}
        rowIndex={rowIndex}
        columnIndex={columnIndex}
        nextPlayer={nextPlayer}
        openCard={openCard}
      />
    );
  });

  return (
    <div className={style.row}>
    {generateCells}
    </div>
  );
};

class Game extends Component {
  level = 1
  timerClock = null
  clickedCards = []

  constructor(props) {
    super(props);
    // 2n 2n n^2
    this.state = {
      gridBoard: this.createNewBoard(this.level),
      peakUsed: false,
      oddBonus: false,
      evenBonus: false,
      bonusConsumed: false,
      timer: 0,
      disableClick: false
    };
  }
  
  componentDidMount() {
    this.timerClock = setInterval(() => {
      const { timer, bonusConsumed, evenBonus, oddBonus } = this.state;
      const newState = {
        timer: timer + 1
      };
      
      if (Math.random() > 0.95) {
        if (!bonusConsumed && (!evenBonus && !oddBonus)) {
          if (Math.round(Math.random()) === 1) {
            newState.evenBonus = true;
          }
          else {
            newState.oddBonus = true;
          }
        }
      }

      this.setState({ ...this.state, ...newState });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerClock);
  }

  // insert and then shuffle

  createNewBoard = (level) => {
    const rows = 2 * level;
    const columns = 2 * level;
    const multiplier = Math.pow(level, 2);
    const indexingLimit = 2 * multiplier;
    let multiplierArr = new Array(indexingLimit).fill(0);
    multiplierArr = multiplierArr.map((v, i) => i + 1);
    multiplierArr = [...multiplierArr, ...multiplierArr].sort(() => Math.random() - Math.random());
    let result = [];
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      result.push(new Array(columns).fill(0));
    }

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
        const elementToInsert = multiplierArr.pop();
        const cell = {
          value: elementToInsert,
          isOpen: false,
          isMatched: false,
          rowIndex,
          columnIndex
        };
        result[rowIndex][columnIndex] = cell;
      }
    }

    return result;
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

  getFontSize = (level) => {
    const suffix = 'px';
    let size;
    if (level <=2) {
      size = 12;
    }
    else if (level < 4) {
      size = 8;
    }
    else {
      size = 7;
    }

    return size + suffix;
  }

  checkIfCardsAreMatched = () => {
    let tempCell = null;
    
    if (this.clickedCards.length !== 2) {
      return;
    }

    this.setState({ disableClick: true }, () => {
      const { gridBoard } = this.state;
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
        }
      });
      this.setState({ gridBoard, disableClick: false }, () => {
        this.clickedCards = [];
        this.isGameOver();
      });
    });


  }

  resetLevel = (level) => {

  }

  isGameOver = () => {
    const { gridBoard } = this.state;
    const isGameOver = gridBoard.every(cardRow => cardRow.every(card => card.isMatched));
    if (isGameOver) {
      if (this.level < 3) {
        this.level++;
        this.setState({
          gridBoard: this.createNewBoard(this.level)
        });
      }
      else {
        const { timer } = this.state;
        localStorage.setItem('score', timer);
        route('/score');
      }
    }
  }

  renderGrid = () => {
    const { gridBoard, disableClick } = this.state;
    return gridBoard.map((row, index) => <Row disableClick={disableClick} openCard={this.openCard} row={row} rowIndex={index} />);
  }

  revealCards = (state) => {
    let { gridBoard } = this.state;
    gridBoard = gridBoard.map(rows => rows.map(cell => {
      cell.isOpen = state;
      return cell;
    }));

    return gridBoard;
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

  matchBonus = (event) => {
    const { currentTarget } = event;
    const type = parseInt(currentTarget.getAttribute('data-type'),10);
    let { gridBoard } = this.state;
    gridBoard = gridBoard.map(rows => rows.map(cell => {
      if (cell.value % 2 === type) {
        cell.isMatched = true;
      }
      return cell;
    }));
    const stateToUpdate = {};
    stateToUpdate.gridBoard = gridBoard;
    if (type % 2 === 0) {
      stateToUpdate.evenBonus = false;
    }
    else {
      stateToUpdate.oddBonus = false;
    }

    stateToUpdate.bonusConsumed = true;

    this.setState({ ...stateToUpdate }, () => {
      setTimeout(() => {
        this.isGameOver();
      }, 1200);
    });
  }

  render() {
    return (
      <div class={style.home}>
        <div class={style.timer}><span>{this.state.timer}</span></div>
        <div className={style.game} style={{ fontSize: this.getFontSize(this.level) }}>
          {this.renderGrid()}
        </div>
          
        <div class={style.buttonContainer}>
          <button disabled={this.state.peakUsed} onClick={this.revealAll}
            class={`${style.button} ${style.bluebtn}`}
          >P</button>
          <button disabled={!this.state.evenBonus}
            onClick={this.matchBonus}
            data-type="0"
            class={`${style.button} ${style.greenbtn}`}
          >E</button>
          <button disabled={!this.state.oddBonus}
            data-type="1"
            onClick={this.matchBonus}
            class={`${style.button} ${style.orangebtn}`}
          >O</button>
        </div>
        
        {/* <button className={style.fixedBtn}
          disabled={this.state.peakUsed}onClick={this.revealAll}
        > Sneak Peak</button> */}
      </div>
    );
  }
}

export default Game;
