import React from "react";
import { TileType } from "../Board";
import classNames from "classnames";

interface TileComponentProps {
    tile: TileType,
    highlighted: boolean,
    selected: boolean,
    error: boolean,
    onClick: () => void,
}

export function TileComponent(props: TileComponentProps) {

    let class_names = classNames({
        sudoku__tile: true,
        sudoku__tile__highlighted: props.highlighted,
        sudoku__tile__selected: props.selected,
        sudoku__tile__error: props.error,
    })
    return (
        <button className={class_names} onClick={props.onClick}>
            {props.tile.value}
        </button>
    )
}