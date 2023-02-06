import * as _ from "lodash";

export type TileType = {
    value: number | null;
    given: boolean;
}

export interface BoardInterface {
    tiles: TileType[]
}

export class Board implements BoardInterface {

    tiles: TileType[];

    constructor(bp: BoardInterface) {
        this.tiles = bp.tiles;
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
                        selected: false,
                        highlighted: false,
                        error: false,
                    };
                })
        }
    }

    static getSolved(): BoardInterface {

        // the function will try to pick random numbers for each
        // tile recursively
        function trySolutions(index: number, t: (number | null)[]): number[] | null {
            if (index === t.length) {
                return t.map((v) => v === null ? 0 : v);
            }
            // let each tile keep track of which numbers it has already guessed
            let unattempted_numbers = Array(9).fill(false).map((_, i) => i + 1);
            unattempted_numbers = _.shuffle(unattempted_numbers)

            let tiles = t.slice()
            for (let num of unattempted_numbers) {
                tiles[index] = num;

                if (Board.prototype.checkCollision.call({ tiles: tiles }, index)) {
                    continue;
                }

                let possible_solution = trySolutions(index + 1, tiles)
                if (possible_solution !== null) {
                    return possible_solution;
                }
            }

            // if no possible solutions were found down his route return null
            return null;

        }

        let solution = trySolutions(0, Array(81).fill(null))

        if (solution !== null) {
            console.log(solution)
            return {
                tiles: solution.map((v) => {
                    return {
                        value: v,
                        given: true,
                        error: false,
                        selected: false,
                        highlighted: false
                    };
                })
            };
        }

        console.error("unable to find a solution")

        return this.getBlankBoardBlueprint();
    }
}



