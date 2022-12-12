var inputs: string[] = readline().split(' ');
const width: number = parseInt(inputs[0]);
const height: number = parseInt(inputs[1]);

let logString = ``;

interface Tile {
    x: number;
    y: number;
    scrapAmount?: number;
    owner?: number;
    units?: number;
    recycler?: number;
    canBuild?: number;
    canSpawn?: number;
    inRangeOfRecycler?: number;
}

interface ControlTile extends Tile {
    isAssigned: boolean;
}

let tiles: ControlTile[] = generateInitialTiles();

const centerX = Math.floor(width / 2);
const centerY = Math.floor(height / 2);

let centerTile: Tile = { x: centerX, y: centerY, scrapAmount: 6969 };

// game loop
while (true) {
    var inputs: string[] = readline().split(' ');
    const myMatter: number = parseInt(inputs[0]);
    const oppMatter: number = parseInt(inputs[1]);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            var inputs: string[] = readline().split(' ');
            const scrapAmount: number = parseInt(inputs[0]);
            const owner: number = parseInt(inputs[1]); // 1 = me, 0 = foe, -1 = neutral
            const units: number = parseInt(inputs[2]);
            const recycler: number = parseInt(inputs[3]);
            const canBuild: number = parseInt(inputs[4]);
            const canSpawn: number = parseInt(inputs[5]);
            const inRangeOfRecycler: number = parseInt(inputs[6]);

            updateTileState();
            
            handleMove();

            handleSpawn();

            // 0. Attack!
            // 1. Try to take all uncontrolled tiles
            // 2. Try to take center tile
            // 3. Move randomly by 1 tile if center is controlled
            function handleMove() {
                if (units === 0 || owner !== 1) return;
                // check if adjacent tiles are controlled by foe and move to them
                const adjacentTiles = tiles.filter(tile => Math.abs(tile.x - x) <= 1 && Math.abs(tile.y - y) <= 1 && tile.owner === 0);
                if (adjacentTiles.length > 0) {
                    console.error('attacking!');
                    const closestAdjacentTile = getClosestTile(x, y, adjacentTiles);
                    if (closestAdjacentTile !== null) {
                        logString += `MOVE ${1} ${x} ${y} ${closestAdjacentTile.x} ${closestAdjacentTile.y};`;
                        return;
                    }
                }

                // console.error(`current position: x: ${x}, y: ${y}`);
                const uncontrolledTiles = tiles.filter(tile => tile.owner !== 1);
                if (uncontrolledTiles.length === 0) {
                    const closestUncontrolledTile = getClosestTile(x, y, uncontrolledTiles.filter(tile => tile.owner !== 1));
                    if (closestUncontrolledTile !== null) {
                        logString += `MOVE ${1} ${x} ${y} ${closestUncontrolledTile.x} ${closestUncontrolledTile.y};`;
                        return;
                    }
                }

                // if center is not controlled, move to center
                if (centerTile.owner !== 1 && centerTile.scrapAmount! > 0) { 
                    logString += `MOVE ${1} ${x} ${y} ${centerTile.x} ${centerTile.y};`;
                    return;
                }

                // center is controlled, move randomly by 1 tile
                const randomX = Math.floor(Math.random() * 3) - 1;
                const randomY = Math.floor(Math.random() * 3) - 1;
                logString += `MOVE ${1} ${x} ${y} ${x + randomX} ${y + randomY};`;
            }

            // 1. Try to spawn unit closest to center
            // 2. Try to spawn unit
            //FIXME: clean up spawning bugs. it tries to spawn in illegal position or without enough matter.. even though i have my if condition...
            function handleSpawn() {
                if (myMatter <= 10) return;
                //find closest controlled tile to center
                const controlledTiles = tiles.filter(tile => tile.owner === 1);
                const closestControlledTile = getClosestTile(centerTile.x, centerTile.y, controlledTiles);
                if (closestControlledTile !== null) {
                    logString += `SPAWN ${1} ${closestControlledTile.x} ${closestControlledTile.y};`;
                    return;
                }

                if (canSpawn === 1) {
                    logString += `SPAWN ${1} ${x} ${y};`;
                }
            }

            function handleBuild() {}

            function updateTileState() {
                const tileIndex = tiles.findIndex(tile => tile.x === x && tile.y === y);
                tiles[tileIndex] = { ...tiles[tileIndex], scrapAmount, owner, units, recycler, canBuild, canSpawn, inRangeOfRecycler };
            }

            function getClosestTile(x: number, y: number, tiles: Tile[]): Tile | null {
                if (tiles.length === 0) return null;
                return tiles.reduce((prev, curr) => {
                    const prevDistance = Math.sqrt(Math.pow(prev.x - x, 2) + Math.pow(prev.y - y, 2));
                    const currDistance = Math.sqrt(Math.pow(curr.x - x, 2) + Math.pow(curr.y - y, 2));
                    return prevDistance < currDistance ? prev : curr;
                });
            }

        }
    }

    if (logString.length === 0) {
        logString = 'WAIT;';
    }

    console.log(logString);
    logString = '';
}

// for linter
// function readline() {
//     return '';
// }

function generateInitialTiles() {
    const tiles: ControlTile[] = [];
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            tiles.push({ x: j, y: i, isAssigned: false });
        }
    }
    return tiles;
}