import React from 'react';
import {FrameType} from 'Game';
import './Board.css';

interface Props {
  currentFrame: FrameType[],
  toggleTile(index: number, _e: React.SyntheticEvent): void
}

export default function Board({currentFrame, toggleTile}: Props) {
  const rgb = (values: number[]) => {
    return `rgb(${values[0]}, ${values[1]}, ${values[2]})`;
  };

  const styleObj = (frame: FrameType) => {
    return {
      color: rgb(frame.colorScheme[0]),
      borderColor: rgb(frame.colorScheme[1]),
      backgroundColor: rgb(frame.colorScheme[2]),
      fontSize: '3em'
    };
  };
  
  return (
    <div className="Board">
      {currentFrame.map((tile, index) => {
        return (
          <div 
            key={index} 
            onClick={(e) => toggleTile(index, e)} 
            className="Tile"
            style={styleObj(tile)}>
              {tile.playedBy}
          </div>
        );
      })}
    </div>
  );
}