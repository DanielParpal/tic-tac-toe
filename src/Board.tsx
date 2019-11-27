import React, { useContext, Dispatch } from 'react';
import {tileIsPartOfWinningSequence} from './modules/engine';
import {TileType, ActionType} from 'Game';
import './Board.css';

interface Props {
  currentFrame: TileType[],
  moves: number[],
  winningSequence: number,
  dispatch: Dispatch<ActionType>
}

export default function Board({currentFrame, moves, winningSequence, dispatch}: Props) {

  const rgb = (values: number[]) => {
    return `rgb(${values[0]}, ${values[1]}, ${values[2]})`;
  };

  const styleObj = (tile: TileType) => {
    return {
      color: rgb(tile.colorScheme[0]),
      borderColor: rgb(tile.colorScheme[1]),
      backgroundColor: rgb(tile.colorScheme[2]),
      fontSize: '2.5em'
    };
  };

  const getClassName = (tile: TileType, index: number) => {
    if (winningSequence === 0) return 'Tile';

    const isAWinningTile = tileIsPartOfWinningSequence(index, winningSequence);
    return isAWinningTile ? 'Tile Tile__winning' : 'Tile';
  }
  
  return (
    <div className='Board'>
      {currentFrame.map((tile, index) => {
        return (
          <div 
            key={index} 
            onClick={() => dispatch({type: 'play', payload: {tilePlayed: index}})} 
            className={getClassName(tile, index)}
            style={styleObj(tile)}>
              {/* {tile.playedBy ? tile.playedBy : moves[index]} */}
              {tile.playedBy ? tile.playedBy : ''}
          </div>
        );
      })}
    </div>
  );
}