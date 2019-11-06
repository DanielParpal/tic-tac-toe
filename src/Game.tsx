import React, {useState} from 'react';
import './Game.css';

const Game: React.FC = () => {
  const TurnsEnum = {
    X: 'X',
    O: 'O'
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
    console.log(grid);

    checkForWinner();

    if (winner === '') {
      const newTurn = turn === TurnsEnum.X ? TurnsEnum.O : TurnsEnum.X;
      setTurn(newTurn);
    }
  }

  const checkForWinner = (): string => {
    checkRows();
    checkColumns();
    checkDiagonal1();
    checkDiagonal2();
    
    return "ABC";
  };

  const checkRows = () => {
    for (const i of [0, 1, 2]) {
      let winner = '';
      for (const j of [0, 1, 2]) {
        const tile = grid[i][j];
        if (tile === '') break;
        if (j === 0) {
          winner = tile;
          continue;
        } else {
          if (tile === winner) {
            if (j === 2) {
              console.log("rows", i);
              setWinner(tile);
              return;
            } else {
              continue;
            }
          } else {
            break;
          }
        }
      }
    }
  }
  
  const checkColumns = () => {
    for (const i of [0, 1, 2]) {
      let winner = '';
      for (const j of [0, 1, 2]) {
        const tile = grid[j][i];
        if (tile === '') break;
        if (j === 0) {
          winner = tile;
          continue;
        } else {
          if (tile === winner) {
            if (j === 2) {
              console.log("columns");
              setWinner(tile);
              return;
            } else {
              continue;
            }
          } else {
            break;
          }
        }
      }
    }
  }

  const checkDiagonal1 = () => {
    let winner = '';
    for (const i of [0, 1, 2]) {
      const tile = grid[i][i];
      if (tile === '') break;
      if (i === 0) {
        winner = tile;
        continue;
      } else {
        if (tile === winner) {
          if (i === 2) {
            console.log("diag 1");
            setWinner(tile);
            return;
          } else {
            continue;
          }
        } else {
          break;
        }
      } 
    }
  }

  const checkDiagonal2 = () => {
    let winner = '';
    for (const i of [0, 1, 2]) {
      const tile = grid[i][2-i];
      if (tile === '') break;
      if (i === 0) {
        winner = tile;
        continue;
      } else {
        if (tile === winner) {
          if (i === 2) {
            console.log("diag 2");
            setWinner(tile);
            return;
          } else {
            continue;
          }
        } else {
          break;
        }
      } 
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