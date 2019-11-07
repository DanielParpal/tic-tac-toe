import React, {useState} from 'react';
import './Game.css';
import {checkForWin} from './modules/engine';

const Game: React.FC = () => {
  const TurnsEnum = {
    x: 'x',
    o: 'o'
  };

  const [frames, setFrames] = useState([new Array(9).fill('')]);
  const [turn, setTurn] = useState(TurnsEnum.x);
  const [winner, setWinner] = useState('');

  // TO-DO: Add a time travel option
  // TO-DO: We'll add a restart button

  const toggleTile = (index: number, _e: React.SyntheticEvent) => {
    if (isAlreadyOccupiedAtIndex(index)) return;
    
    const newFrame = lastFrame();
    newFrame[index] = turn;
    setFrames(frames.concat([newFrame]));

    const gameWon = checkForWin(newFrame, turn);

    if (gameWon) {
      setWinner(turn)
    } else {
      const newTurn = turn === TurnsEnum.x ? TurnsEnum.o : TurnsEnum.x;
      setTurn(newTurn);
    }
  }

  const isAlreadyOccupiedAtIndex = (index: number): boolean => {
    return lastFrame()[index] !== '';
  }

  const lastFrame = (): string[] => {
    return frames[frames.length-1];
  };

  return (
    <div>
      <p>Player turn: {turn}</p>
      <div className="Grid">
        {lastFrame().map((tile, index) => {
          return (
            <div key={index} onClick={(e) => toggleTile(index, e)} className="Tile">
              {tile}
            </div>
          );
        })}
      </div>
      <p>{winner !== '' ? "winner is: " + winner : ''}</p>
    </div>
  )
}

export default Game;