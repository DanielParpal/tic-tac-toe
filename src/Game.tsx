import React, {useState} from 'react';
import './Game.css';

const Game: React.FC = () => {
  const [grid, setGrid] = useState([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
  
  const tiles = grid.map((row, indexRow) => {
    return (
      <div key={'row-' + indexRow}>
        {row.map((tile, indexCol) => {
          return (
            <div className='Tile' key={'col-' + indexRow + '-' + indexCol}>
              {tile}
            </div>
          );
        })}
      </div>
    );
  });

  console.log(tiles);

  return (
    <div>{tiles}</div>
  )
}

export default Game;