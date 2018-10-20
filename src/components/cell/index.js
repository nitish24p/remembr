import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';

const Cell = (props) => {
  const { cell, disableClick } = props;
  return (
    <button className={`${style.cell} ${cell.isOpen ? style.open : ''} 
      ${!cell.hide && cell.isMatched ? style.match : ''}
      ${cell.hide ? style.hide : ''}
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

export default Cell;
