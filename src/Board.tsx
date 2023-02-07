import * as _ from "lodash";

export type TileType = {
    value: number | null;
    given: boolean;
}

export interface BoardInterface {
    tiles: TileType[],
}

export class Board implements BoardInterface {

    tiles: TileType[];

    constructor(bp: BoardInterface) {
        this.tiles = structuredClone(bp.tiles);
    }

    getRelated(tile: number): number[] {
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
    }

    checkCollision(tile: number): boolean {
        if (this.tiles[tile].value === null) { return false; }
        return this.getRelated(tile)
            .map((tile_idx) => this.tiles[tile_idx].value === this.tiles[tile].value)
            .reduce((a, b) => a || b, false)
    }

    selectTile(tile: number): BoardInterface {
        let related_tiles = this.getRelated(tile)
        return {
            ...this,
            tiles: this.tiles.map((val, i) => {
                return {
                    ...val,
                    selected: i === tile,
                    highlighted: i
                }
            })
        }
    }

    static getBlankBoardBlueprint(): BoardInterface {
        return {
            tiles: Array(81)
                .fill(null)
                .map(() => {
                    return {
                        value: null,
                        given: false,
                    };
                })
        }
    }

    static getSolved(): BoardInterface {

        // the function will try to pick random numbers for each
        // tile recursively
        function trySolutions(index: number, board: Board): BoardInterface | null {
            if (index === board.tiles.length) {
                return board;
            }
            // let each function call keep track of which numbers
            // it has already guessed for its tile
            let unattempted_numbers = Array(9).fill(null).map((_, i) => i + 1);
            unattempted_numbers = _.shuffle(unattempted_numbers)

            let new_board = new Board(board)
            for (let num of unattempted_numbers) {
                new_board.tiles[index].value = num;

                if (new_board.checkCollision(index)) {
                    continue;
                }

                let possible_solution = trySolutions(index + 1, new_board)
                if (possible_solution === null) {
                    continue;
                }
                else {
                    return possible_solution;
                }
            }

            // if no possible solutions were found down his route return null
            return null;

        }

        let solution = trySolutions(0, new Board(Board.getBlankBoardBlueprint()))

        if (solution === null) {
            console.error("unable to find a solution")
            return this.getBlankBoardBlueprint();
        }

        console.log("Found solution: ", solution)
        return solution;
    }
}



