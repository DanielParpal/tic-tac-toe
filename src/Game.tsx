import React, {useState, useEffect, useReducer} from 'react';
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

export interface ActionType {
  type: 'reset' | 'travel' | 'play',
  payload: {
    resetTo?: number,
    tilePlayed?: number
  }
}



const emptyFrames = [new Array(9).fill({
    playedBy: '',
  })];


function reducer(state: TileType[][], action: ActionType) {
  switch (action.type) {
    case 'travel':
      if (action.payload.resetTo === undefined) return emptyFrames;
      return state.slice(0, action.payload.resetTo + 1);
    case 'play':
      if (action.payload.tilePlayed === undefined) return emptyFrames;
      return toggleTile(state, action.payload.tilePlayed);
    default: 
      return emptyFrames;
    }
}

const toggleTile = (frames: TileType[][], index: number) => {
  if (moveIsNotLegalAt(frames, index)) return frames;

  return markTileToCurrentPlayer(frames, index);
};

const moveIsNotLegalAt = (frames: TileType[][], index: number) => {
  return gameIsOver(frames) || tileIsOccupiedAtIndex(frames, index);
};

const markTileToCurrentPlayer = (frames: TileType[][], index: number) => {
  const newFrame = [...lastFrame(frames)];

  newFrame[index] = {
    playedBy: getCurrentTurn(frames),
    colorScheme: defaultColors
  };

  return frames.concat([newFrame]);
};

const tileIsOccupiedAtIndex = (frames: TileType[][], index: number): boolean => {
  return lastFrame(frames)[index].playedBy !== '';
};

const lastFrame = (frames: TileType[][]): TileType[] => {
  return frames[frames.length - 1];
};

const gameIsOver = (frames: TileType[][]) => {
  return hasWinner(frames) || gameIsADraw(frames);
};

const hasWinner = (frames: TileType[][]) => {
  const w = winner(frames);
  return w.player !== '';
}

const winner = (frames: TileType[][]) => {
  const winningPattern = checkForWinningPattern(encodedState(frames), lastPlayedBy(frames));

  if (winningPattern) {
    return {player: lastPlayedBy(frames), sequence: winningPattern};
  } else {
    return {player: '', sequence: 0};
  }
}

const winningSequence = (frames: TileType[][]) => {
  return winner(frames).sequence;
}

const gameIsADraw = (frames: TileType[][]) => {
  const s = encodedState(frames);
  return !s.includes('0');
}

const encodedState = (frames: TileType[][]) => {
  return lastFrame(frames).map((tile) => {
    return tile.playedBy !== '' ? tile.playedBy : '0';
  }).join('');
};

const getCurrentTurn = (frames: TileType[][]) => {
  return frames.length % 2 === 1 ? TurnsEnum.x : TurnsEnum.o;
};

const lastPlayedBy = (frames: TileType[][]) => {
  return frames.length % 2 === 1 ? TurnsEnum.o : TurnsEnum.x;
};

export default function Game() {

  const [frames, dispatch] = useReducer(reducer, emptyFrames);
  const [moves, setMoves] = useState(new Array(9).fill(-Infinity));
  const [colorSchemes, setColorSchemes] = useState(defaultColors);

  useEffect(() => {
    // fetchColorSchemes();
  }, []);

  useEffect(() => {

    const currentTurn = getCurrentTurn(frames);
    const moves: number[] = getWeightedMovesForPlayer(encodedState(frames), currentTurn);
    setMoves(moves);

    if (currentTurn === 'o') {
      playAI(frames, moves);
    }

  }, [frames]);



  const ColorsContext = React.createContext(colorSchemes);

  const playAI = (frames: TileType[][], playerMoves: number[]) => {
    const maxValue = Math.max(...playerMoves);

    for (const i in playerMoves) {
      const index = parseInt(i);
      if (playerMoves[index] === maxValue) {
        dispatch({type: 'play', payload: {tilePlayed: index}})
        break;
      }
    }
  }

  const gameTitle = () => {
    let content;
    if (hasWinner(frames)) {
      content = "Winner is: " + winner(frames).player;
    } else if (gameIsADraw(frames)) {
      content = "Game is a draw!"
    } else {
      content = "Player turn: " + getCurrentTurn(frames);
    }
    return content;
  }

  return (
    <ColorsContext.Provider value={colorSchemes}>
      <div className="Grid">
        <div>
          <h4>{gameTitle()}</h4>
          <Board currentFrame={lastFrame(frames)} moves={moves} winningSequence={winningSequence(frames)} dispatch={dispatch} />
          <button onClick={() => dispatch({type: 'reset', payload: {}})}>Restart game</button>
        </div>
        
        <TimeTravel frames={frames} dispatch={dispatch} />
      </div>
    </ColorsContext.Provider>
  );
}
