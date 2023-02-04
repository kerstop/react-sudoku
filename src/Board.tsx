
export type TileType = {
    value: number | null;
    given: boolean;
    selected: boolean;
    highlighted: boolean;
    error: boolean;
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

    selectTile(tile:number): BoardInterface {
        let related_tiles = this.getRelated(tile)
        return {
            ...this,
            tiles: this.tiles.map((val,i) => {
                return {...val,
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

        function trySolution(index: number, ) {

        }

        return this.getBlankBoardBlueprint();
    }
}



