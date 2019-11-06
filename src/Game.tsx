import React, {useState} from 'react';
import './Game.css';

const Game: React.FC = () => {
  const TurnsEnum = {
    X: 'X',
    O: 'O'
  };

  const [grid, setGrid] = useState([['', '', ''], ['', '', ''], ['', '', '']]);
  const [turn, setTurn] = useState(TurnsEnum.X);

  const toggleTile = (row: number, col: number, e: React.SyntheticEvent) => {
    console.log("row", row);
    console.log("col", col);
    const currentState = grid[row][col];
    if (currentState !== '') return;
    
    const newGrid = grid;
    newGrid[row][col] = turn;
    setGrid([...grid]);
    const newTurn = turn === TurnsEnum.X ? TurnsEnum.O : TurnsEnum.X;
    setTurn(newTurn);
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
    <div>{tiles}</div>
  )
}

export default Game;