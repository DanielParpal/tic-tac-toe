import React, {useState, useEffect, useCallback} from 'react';
import './Game.css';
import Board from './Board';
import TimeTravel from './TimeTravel';
import {checkForWin} from './modules/engine';

export interface FrameType {
  playedBy: string,
  colorScheme: number[][]
}

export default function Game() {

  const TurnsEnum = {
    x: 'x',
    o: 'o'
  };

  const defaultColors = (): number[][] => {
    return [
      [16, 16, 16],
      [16, 16, 16],
      [240, 240, 240]
    ];
  }

  const emptyFrames = (): FrameType[][] => {
    return [new Array(9).fill({
      playedBy: '',
      colorScheme: defaultColors()
    })];
  };

  const [frames, setFrames] = useState(emptyFrames());
  const [turn, setTurn] = useState(TurnsEnum.x);
  const [winner, setWinner] = useState('');

  const getCurrentTurn = useCallback(() => {
    return frames.length % 2 === 1 ? TurnsEnum.x : TurnsEnum.o;
  }, [frames, TurnsEnum]);

  const lastFrame = useCallback((): FrameType[] => {
    return frames[frames.length - 1];
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

  const toggleTile = async (index: number, _e: React.SyntheticEvent) => {
    if (moveIsNotLegalAt(index)) return;

    await markTileToCurrentPlayer(index);
  };

  const moveIsNotLegalAt = (index: number) => {
    return gameIsOver() || tileIsOccupiedAtIndex(index);
  };

  const tileIsOccupiedAtIndex = (index: number): boolean => {
    return lastFrame()[index].playedBy !== '';
  };

  const markTileToCurrentPlayer = async (index: number) => {
    const newFrame = [...lastFrame()];

    newFrame[index] = {
      playedBy: turn,
      colorScheme: await generateNewColorScheme()
    };

    setFrames(frames.concat([newFrame]));
  };

  const travelTo = (index: number, _e: React.SyntheticEvent) => {
    const newFrames = frames.slice(0, index + 1);
    setFrames(newFrames);
  };
  
  const restartGame = () => {
    setFrames(emptyFrames());
  };

  const gameIsOver = () => {
    return winner !== '';
  };

  const generateNewColorScheme = async () => {
    const data = {model: 'default'};
    const request = new Request('http://colormind.io/api/', {method: 'POST', body: JSON.stringify(data)});
    const response = await fetch(request);

    return (await response.json()).result.slice(0, 3);
  };

  return (
    <div className="Grid">
      <div>
        <p>{gameIsOver() ? "Winner is: " + winner : "Player turn: " + turn}</p>
        <Board currentFrame={lastFrame()} toggleTile={toggleTile} />
        <button onClick={restartGame}>Restart game</button>
      </div>
      
      <TimeTravel frames={frames} travelTo={travelTo} />
    </div>
  );
}
