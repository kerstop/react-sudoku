import { useState } from "react";
import React from "react";
import classNames from "classnames";
import "./App.css";

type Tile = {
    value: number | null;
    given: boolean;
    selected: boolean;
    highlighted: boolean;
    error: boolean;
}

class Board {
    tiles: Tile[];
    constructor(board?: Board) {
        if (board === undefined) {
            this.tiles = Array(81)
                .fill(null)
                .map(() => {
                    return {
                        value: null,
                        given: false,
                        selected: false,
                        highlighted: false,
                        error: false,
                    };
                })
        } else {
            this.tiles = board.tiles.slice()
        }
    }
}

function App() {
    let [board, setBoard] = useState<Board>(() => new Board());

    /**
     *  Callback function for number button component to say
     *  it has been clicked
     */
    let numSelected = (n: number) => {
        let new_board = new Board(board);

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
            tile.error = checkCollision(i);
        })
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

    /**
     *  Callback function for the tile components
     */
    let tileClicked = (tile: number) => {
        if (board.tiles[tile].selected === true) return;

        console.log("clicked " + tile);
        console.log("related tiles:");
        console.log(relatedTiles(tile));

        let board_new = new Board(board);

        board_new.tiles.forEach((tile) => {
            tile.selected = false;
            tile.highlighted = false;
        });

        relatedTiles(tile).forEach((i) => {
            board_new.tiles[i].highlighted = true;
        });

        board_new.tiles[tile].selected = true;

        setBoard(board_new);
    };

    /**
     *  Returns true if the tile has a collision
     */
    let checkCollision = (tile: number): boolean => {
        if (board.tiles[tile].given || board.tiles[tile].value == null) {
            return false;
        }
        return relatedTiles(tile)
            .map((x) => board.tiles[tile].value === board.tiles[x].value)
            .reduce((a, b) => a || b, false);
    };

    return (
        <>
            <div className="sudoku__tile-container">
                {board.tiles.map((x, i) => {
                    return (
                        <Tile
                            key={i}
                            highlighted={x.highlighted}
                            selected={x.selected}
                            error={x.error}
                            value={x.value}
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

interface TileProps {
    highlighted: boolean;
    selected: boolean;
    error: boolean;
    onClick: () => void;
    value: number | null;
}

function Tile(props: TileProps) {
    let className = classNames({
        sudoku__tile: true,
        sudoku__tile__highlighted: props.highlighted,
        sudoku__tile__selected: props.selected,
        sudoku__tile__error: props.error,
    });
    return (
        <button className={className} onClick={props.onClick}>
            {props.value}
        </button>
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
