import React, {useState, useEffect, useCallback, useMemo} from 'react';
import './Game.css';
import Board from './Board';
import TimeTravel from './TimeTravel';
import {checkForWinningPattern} from './modules/engine';
import {getWeightedMovesForPlayer} from './modules/minimax';

export interface TileType {
  playedBy: string,
  colorScheme: number[][]
}

export interface WinnerType {
  player: string,
  sequence: number
}
export const TurnsEnum = {
  x: 'x',
  o: 'o'
};

export default function Game() {

  const defaultColors = [
    [180, 180, 180],
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
  const [winner, setWinner] = useState(noWinner);
  const [moves, setMoves] = useState(new Array(9).fill(-Infinity));
  const [isAITurn, setIsAITurn] = useState(false);

  const getCurrentTurn = useCallback(() => {
    return frames.length % 2 === 1 ? TurnsEnum.x : TurnsEnum.o;
  }, [frames]);

  const lastPlayedBy = useCallback(() => {
    return frames.length % 2 === 1 ? TurnsEnum.o : TurnsEnum.x;
  }, [frames]);

  const lastFrame = useCallback((): TileType[] => {
    return frames[frames.length - 1];
  }, [frames]);

  const encodedState = useCallback(() => {
    return lastFrame().map((tile) => {
      return tile.playedBy !== '' ? tile.playedBy : '0';
    }).join('');
  }, [lastFrame]);

  // Let's chat about why adding getCurrentTurn to the dependancy list breaks everything
  useEffect(() => {
    const winningPattern = checkForWinningPattern(encodedState(), lastPlayedBy());

    if (winningPattern) {
      setWinner({player: lastPlayedBy(), sequence: winningPattern});
      return;
    }

    if (gameIsADraw()) return;
    
    setWinner(noWinner);
    const currentTurn = getCurrentTurn();
    const moves: number[] = getWeightedMovesForPlayer(encodedState(), currentTurn);
    setMoves(moves);

    if (currentTurn === 'o') {
      console.log(moves);
      playAI(moves);
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

  const playAI = async (playerMoves: number[]) => {
    const maxValue = Math.max(...playerMoves);

    for (const i in playerMoves) {
      const index = parseInt(i);
      if (playerMoves[index] === maxValue) {
        await markTileToCurrentPlayer(index);
        break;
      }
    }
  }

  const markTileToCurrentPlayer = async (index: number) => {
    const newFrame = [...lastFrame()];

    newFrame[index] = {
      playedBy: getCurrentTurn(),
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

  const gameIsADraw = () => {
    const s = encodedState();
    return !s.includes('0');
  }

  const gameIsOver = () => {
    return winner.player !== '';
  };

  const generateNewColorScheme = async () => {
    const data = {model: 'default'};
    const request = new Request('http://colormind.io/api/', {method: 'POST', body: JSON.stringify(data)});
    const response = await fetch(request);

    return (await response.json()).result.slice(0, 3);
  };

  const gameTitle = () => {
    let content;
    if (gameIsOver()) {
      content = "Winner is: " + winner.player;
    } else if (gameIsADraw()) {
      content = "Game is a draw!"
    } else {
      content = "Player turn: " + getCurrentTurn();
    }
    return content;
  }

  return (
    <div className="Grid">
      <div>
        <h4>{gameTitle()}</h4>
        <Board currentFrame={lastFrame()} moves={moves} toggleTile={toggleTile} winningSequence={winner.sequence} />
        <button onClick={restartGame}>Restart game</button>
      </div>
      
      <TimeTravel frames={frames} travelTo={travelTo} />
    </div>
  );
}
