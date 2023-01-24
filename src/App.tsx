import { useState } from "react";
import React from "react";
import classNames from "classnames";
import "./App.css";

function App() {
    let [board, setBoard] = useState(() =>
        Array(81)
            .fill(null)
            .map(() => {
                return {
                    value: null,
                    given: false,
                    selected: false,
                    highlighted: false,
                };
            })
    );

    let numSelected = (n) => {
        let new_board = board.slice();
        for (let i in new_board) {
            if (new_board[i].selected === true) {
                if (new_board[i].given === true) break;

                if (n === 0) {
                    new_board[i].value = null;
                } else {
                    new_board[i].value = n;
                }

                setBoard(new_board);
                break;
            }
        }
    };

    /**
     * Returns the tiles related to the given tile excluding
     * the given tile
     */
    let relatedTiles = (tile: number): number[] => {
        let tiles: number[] = [];
        for (let j = 0; j < 9; j++) {
            let start_of_row = Math.floor(tile / 9) * 9;
            let column_offset = tile % 9;

            tiles.push(start_of_row + j);
            tiles.push(j * 9 + column_offset);
        }

        for (let j = 0; j < 3; j++) {
            let offset =
                Math.floor(tile / 27) * 27 +
                Math.floor((tile % 9) / 3) * 3 +
                j * 9;
            for (let k = 0; k < 3; k++) {
                tiles.push(offset + k);
            }
            
        }

        return tiles.filter((n) => n !== tile);
    };

    let tileClicked = (i) => {
        if (board[i].selected === true) return;

        console.log("clicked " + i);
        console.log("related tiles:")
        console.log(relatedTiles(i))

        let board_new = board.slice();

        for (let tile in board_new) {
            board_new[tile].highlighted = false;
            board_new[tile].selected = false;
        }

        board_new[i].selected = true;

        //highlight vertical and horizantal
        for (let j = 0; j < 9; j++) {
            let start_of_row = Math.floor(i / 9) * 9;
            let column_offset = i % 9;

            board_new[start_of_row + j].highlighted = true;
            board_new[j * 9 + column_offset].highlighted = true;
        }

        for (let j = 0; j < 3; j++) {
            let offset =
                Math.floor(i / 27) * 27 + Math.floor((i % 9) / 3) * 3 + j * 9;
            for (let k = 0; k < 3; k++) {
                board_new[offset + k].highlighted = true;
            }
        }

        setBoard(board_new);
    };

    return (
        <>
            <div className="sudoku__tile-container">
                {board.map((x, i) => {
                    return (
                        <Tile
                            key={i}
                            highlighted={x.highlighted}
                            selected={x.selected}
                            value={x.value}
                            onClick={() => {
                                tileClicked(i);
                            }}
                        />
                    );
                })}
            </div>

            <NumberButtons numSelected={numSelected} />
        </>
    );
}

function Tile(props) {
    let className = classNames({
        sudoku__tile: true,
        sudoku__tile__highlighted: props.highlighted ^ props.selected,
        sudoku__tile__selected: props.selected,
    });
    return (
        <button className={className} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function NumberButtons(props) {
    return (
        <div className="sudoku__number-button-container">
            {Array(10)
                .fill(0)
                .map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            props.numSelected(i + 1);
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
