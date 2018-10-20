import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';
import Cell from './../cell';

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

export default Row;
