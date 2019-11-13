import React, {useState, useEffect, useCallback, useMemo} from 'react';
import './Game.css';
import Board from './Board';
import TimeTravel from './TimeTravel';
import {checkForWinningPattern} from './modules/engine';

export interface TileType {
  playedBy: string,
  colorScheme: number[][]
}

export interface WinnerType {
  player: string,
  sequence: number
}

export default function Game() {

  const TurnsEnum = {
    x: 'x',
    o: 'o'
  };

  const defaultColors = [
    [16, 16, 16],
    [16, 16, 16],
    [240, 240, 240]
  ];

  const noWinner = {
    player: '',
    sequence: 0
  };

  // Just for fun of using useMemo()
  const emptyFrames = useMemo(() => {
    return [new Array(9).fill({
      playedBy: '',
      colorScheme: defaultColors
    })];
  }, [defaultColors]);

  const [frames, setFrames] = useState(emptyFrames);
  const [turn, setTurn] = useState(TurnsEnum.x);
  const [winner, setWinner] = useState(noWinner);

  const getCurrentTurn = useCallback(() => {
    return frames.length % 2 === 1 ? TurnsEnum.x : TurnsEnum.o;
  }, [frames, TurnsEnum]);

  const lastFrame = useCallback((): TileType[] => {
    return frames[frames.length - 1];
  }, [frames]);

  // Let's chat about why adding getCurrentTurn to the dependancy list breaks everything
  useEffect(() => {
    const winningPattern = checkForWinningPattern(lastFrame(), turn);

    if (winningPattern) {
      setWinner({player: turn, sequence: winningPattern});
    } else {
      setWinner(noWinner);
      setTurn(getCurrentTurn());
    }
  }, [frames]);

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
    setFrames(emptyFrames);
  };

  const gameIsOver = () => {
    return winner.player !== '';
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
        <p>{gameIsOver() ? "Winner is: " + winner.player : "Player turn: " + turn}</p>
        <Board currentFrame={lastFrame()} toggleTile={toggleTile} winningSequence={winner.sequence} />
        <button onClick={restartGame}>Restart game</button>
      </div>
      
      <TimeTravel frames={frames} travelTo={travelTo} />
    </div>
  );
}
