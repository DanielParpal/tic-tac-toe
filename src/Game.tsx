import React, {useState, useEffect, useCallback} from 'react';
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

  const getCurrentTurn = useCallback(() => {
    return frames.length % 2 === 1 ? TurnsEnum.x : TurnsEnum.o;
  }, [frames, TurnsEnum]);

  const lastFrame = useCallback((): string[] => {
    return frames[frames.length-1];
  }, [frames]);

  useEffect(() => {
    const hasWinningPattern = checkForWin(lastFrame(), turn);

    if (hasWinningPattern) {
      setWinner(turn);
    } else {
      setWinner('');
      setTurn(getCurrentTurn());
    }
  }, [frames, lastFrame, turn, getCurrentTurn]);

  const toggleTile = (index: number, _e: React.SyntheticEvent) => {
    if (moveIsNotLegalAt(index)) return;

    markTileToCurrentPlayer(index);
  }

  const moveIsNotLegalAt = (index: number) => {
    return gameIsOver() || tileIsOccupiedAtIndex(index);
  }

  const tileIsOccupiedAtIndex = (index: number): boolean => {
    return lastFrame()[index] !== '';
  }

  const markTileToCurrentPlayer = (index: number) => {
    const newFrame = [...lastFrame()];
    newFrame[index] = turn;
    setFrames(frames.concat([newFrame]));
  }

  const travelTo = (index: number, _e: React.SyntheticEvent) => {
    const newFrames = frames.slice(0, index + 1);
    setFrames(newFrames);
  }
  
  const restartGame = () => {
    setFrames(emptyFrames());
  }

  const gameIsOver = () => {
    return winner !== '';
  }

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
        <p>{gameIsOver() ? "winner is: " + winner : ''}</p>
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