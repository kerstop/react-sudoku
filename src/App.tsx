import { useState } from "react";
import React from "react";
import classNames from "classnames";

import { Board } from "./Board";
import "./App.css";
import { TileComponent } from "./Components/Tile";



function App() {
    let [board, setBoard] = useState<Board>(() => new Board(Board.getBlankBoardBlueprint()));

    /**
     *  Callback function for number button component to say
     *  it has been clicked
     */
    let numSelected = (n: number) => {
        let new_board: Board = new Board(board);

        for (let i in new_board.tiles) {
            if (new_board.tiles[i].selected === true) {
                if (new_board.tiles[i].given === true) break;

                if (n === 0) {
                    new_board.tiles[i].value = null;
                } else {
                    new_board.tiles[i].value = n;
                }

                setBoard(new_board);
                break;
            }
        }

        new_board.tiles.forEach((tile, i) => {
            tile.error = board.checkCollision(i);
        })
    };

        /**
     *  Callback function for the tile components
     */
    let tileClicked = (tile: number) => {
        if (board.tiles[tile].selected === true) return;

        let board_new = new Board(board);

        board_new.tiles.forEach((tile) => {
            tile.selected = false;
            tile.highlighted = false;
        });

        board.getRelated(tile).forEach((i) => {
            board_new.tiles[i].highlighted = true;
        });

        board_new.tiles[tile].selected = true;

        setBoard(board_new);
    };

    return (
        <>
            <div className="sudoku__tile-container">
                {board.tiles.map((x, i) => {
                    return (
                        <TileComponent
                            key={i}
                            tile={x}
                            onClick={() => {
                                tileClicked(i);
                            }}
                        />
                    );
                })}
            </div>

            <NumberButtons callBack={numSelected} />
        </>
    );
}

interface NumberButtonsProps {
    callBack: (num_selected: number) => void;

}

function NumberButtons(props: NumberButtonsProps) {
    return (
        <div className="sudoku__number-button-container">
            {Array(10)
                .fill(0)
                .map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            props.callBack(i);
                        }}
                        className="sudoku__number-button"
                    >
                        {i === 0 ? "C" : i}
                    </button>
                ))}
        </div>
    );
}

export default App;
