import React, {useState} from 'react';
import './Game.css';
import {checkForWin} from './modules/engine';

const Game: React.FC = () => {
  const TurnsEnum = {
    X: 'x',
    O: 'o'
  };

  const [grid, setGrid] = useState([['', '', ''], ['', '', ''], ['', '', '']]);
  const [turn, setTurn] = useState(TurnsEnum.X);
  const [winner, setWinner] = useState('');

  const toggleTile = (row: number, col: number, e: React.SyntheticEvent) => {
    const currentState = grid[row][col];
    if (currentState !== '') return;
    
    const newGrid = grid;
    newGrid[row][col] = turn;
    setGrid([...grid]);

    const gameWon = checkForWin(grid.flat(), turn);

    if (gameWon) {
      setWinner('x')
    } else {
      const newTurn = turn === TurnsEnum.X ? TurnsEnum.O : TurnsEnum.X;
      setTurn(newTurn);
    }
  }

  const tiles = grid.map((row, rowIndex) => {
    return (
      <div key={'row-' + rowIndex}>
        {row.map((tile, colIndex) => {
          return (
            <div onClick={(e) => toggleTile(rowIndex, colIndex, e)} className='Tile' key={'col-' + rowIndex + '-' + colIndex}>
              {tile}
            </div>
          );
        })}
      </div>
    );
  });

  return (
    <div>
      {tiles}
      <div>
        <p>{winner !== '' ? "winner is: " + winner : ''}</p>
      </div>
    </div>
  )
}

export default Game;