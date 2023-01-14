import { useState } from "react";
import classNames from "classnames";
import "./App.css";

function App() {
  let [board, setBoard] = useState(() => Array(81).fill(null));

  let tileClicked = (i) => {
    let board_new = board.slice();
    board_new[i] += 1;
    setBoard(board_new);
  };

  return (
    <>
      <div className="sudoku__tile-container">
        {board.map((x, i) => {
          return (
            <Tile
              key={i}
              value={x}
              onClick={() => {
                tileClicked(i);
              }}
            />
          );
        })}
      </div>
    </>
  );
}

function Tile(props) {
  let className = classNames("sudoku__tile");
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

export default App;
