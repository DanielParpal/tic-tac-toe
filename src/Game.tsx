import React, {useState} from 'react';
import './Game.css';
import {checkForWin} from './modules/engine';

const Game: React.FC = () => {
  const TurnsEnum = {
    x: 'x',
    o: 'o'
  };

  const [tiles, setGrid] = useState(new Array(9).fill(''));
  const [turn, setTurn] = useState(TurnsEnum.x);
  const [winner, setWinner] = useState('');

  // TO-DO: Add a time travel option
  // TO-DO: We'll add a restart button

  const toggleTile = (index: number, _e: React.SyntheticEvent) => {
    if (isAlreadyOccupiedAtIndex(index)) return;
    
    // Let's explore array destructuring later
    const tempTiles = tiles;
    tempTiles[index] = turn;
    setGrid(tempTiles);

    const gameWon = checkForWin(tiles, turn);

    if (gameWon) {
      setWinner(turn)
    } else {
      const newTurn = turn === TurnsEnum.x ? TurnsEnum.o : TurnsEnum.x;
      setTurn(newTurn);
    }
  }

  const isAlreadyOccupiedAtIndex = (index: number): boolean => {
    return tiles[index] !== '';
  }

  return (
    <div className="Grid">
      {tiles.map((tile, index) => {
        return (
          <div key={index} onClick={(e) => toggleTile(index, e)} className="Tile">
            {tile}
          </div>
        );
      })}
      <p>{winner !== '' ? "winner is: " + winner : ''}</p>
    </div>
  )
}

export default Game;