import { useMemo, useState } from "react";
import React from "react";
import classNames from "classnames";
import * as _ from "lodash";

import { Board } from "./Board";
import "./App.css";
import { TileComponent } from "./Components/Tile";



function App() {
    let [board, setBoard] = useState<Board>(() => new Board(Board.getBlankBoardBlueprint()));
    let [selected, setSelected] = useState<number>(0)
    let highlightes: Set<number> = new Set();
    let errors: Set<number> = new Set();

    for (let i of board.getRelated(selected)) {
        highlightes.add(i)
    }

    board.tiles.forEach((_, i) => {
        if (board.checkCollision(i)) {
            errors.add(i)
        }
    })



    /**
     *  Callback function for number button component to say
     *  it has been clicked
     */
    let numSelected = (n: number) => {
        let new_board: Board = new Board(board);

        if (new_board.tiles[selected].given) return;

        new_board.tiles[selected].value = n === 0 ? null : n;

        setBoard(new_board);
    };

    /**
    *  Callback function for the tile components
    */
    let tileClicked = (tile: number) => {
        if (tile === selected) return;

        setSelected(tile);
    };

    let numButonPressed = (e: React.KeyboardEvent) => {
        let keyPressed = parseInt(e.key)
        if (!Number.isNaN(keyPressed)) {
            numSelected(parseInt(e.key))
        }
    }

    return (
        <>
            <div
                className="sudoku__tile-container"
                onKeyDown={numButonPressed}
            >
                {board.tiles.map((x, i) => {
                    return (
                        <TileComponent
                            key={i}
                            tile={x}
                            selected={i === selected}
                            error={board.checkCollision(i)}
                            highlighted={highlightes.has(i)}
                            onClick={() => {
                                tileClicked(i);
                            }}
                        />
                    );
                })}
            </div>

            <NumberButtons callBack={numSelected} />

            <button onClick={() => { setBoard(new Board(Board.getSolved())) }}>
                get a solved board
            </button>
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
