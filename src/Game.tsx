import React, {useState} from 'react';
import './Game.css';
import {checkForWin} from './modules/engine';

const Game: React.FC = () => {
  const TurnsEnum = {
    x: 'x',
    o: 'o'
  };

  const emptyFrames = () => {
    return [new Array(9).fill('')];
  };

  const [frames, setFrames] = useState(emptyFrames());
  const [turn, setTurn] = useState(TurnsEnum.x);
  const [winner, setWinner] = useState('');


  const toggleTile = (index: number, _e: React.SyntheticEvent) => {
    if (isAlreadyOccupiedAtIndex(index)) return;
    
    const newFrame = [...lastFrame()];
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

  const travelTo = (index: number, _e: React.SyntheticEvent) => {
    const newFrames = frames.slice(0, index + 1);
    console.log(newFrames);
    setFrames(newFrames);
    setTurn(getCurrentTurn());
  }

  // TO-DO: useEffect to set turn?
  // Winner should clear if it is not the case anymore

  const restartGame = () => {
    setFrames(emptyFrames());
    setTurn(getCurrentTurn());
  }

  const getCurrentTurn = () => {
    return frames.length % 2 === 1 ? TurnsEnum.x : TurnsEnum.o;
  }

  const isAlreadyOccupiedAtIndex = (index: number): boolean => {
    return lastFrame()[index] !== '';
  }

  const lastFrame = (): string[] => {
    return frames[frames.length-1];
  };

  return (
    <div className="Grid">
      <div>
        <p>Player turn: {turn}</p>
        <div className="Board">
          {lastFrame().map((tile, index) => {
            return (
              <div key={index} onClick={(e) => toggleTile(index, e)} className="Tile">
                {tile}
              </div>
            );
          })}
        </div>
        <p>{winner !== '' ? "winner is: " + winner : ''}</p>
        <button onClick={restartGame}>Restart game</button>
      </div>
      <div>
        <h3>Time travel</h3>
        {
          frames.map((_, index) => {
            const text = index > 0 ? `move ${index}` : "start";
            return <button onClick={(e) => travelTo(index, e)} key={index}>Go to {text}</button>
          })
        }
      </div>
    </div>
  )
}

export default Game;