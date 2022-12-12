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
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
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

            // 1. Try to take all uncontrolled tiles
            // 2. Try to take center tile
            // 3. Move randomly by 1 tile if center is controlled
            function handleMove() {
                const uncontrolledTiles = tiles.filter(tile => tile.owner !== 1);
                if (uncontrolledTiles.length === 0) {
                    const closestUncontrolledTile = getClosestTile(j, i, uncontrolledTiles.filter(tile => tile.owner !== 1));
                    if (closestUncontrolledTile !== null) {
                        logString += `MOVE ${1} ${j} ${i} ${closestUncontrolledTile.x} ${closestUncontrolledTile.y};`;
                        return;
                    }
                }

                // if center is not controlled, move to center
                if (centerTile.owner !== 1 && centerTile.scrapAmount! > 0) { 
                    logString += `MOVE ${1} ${j} ${i} ${centerTile.x} ${centerTile.y};`;
                    return;
                }

                // center is controlled, move randomly by 1 tile
                const randomX = Math.floor(Math.random() * 3) - 1;
                const randomY = Math.floor(Math.random() * 3) - 1;
                logString += `MOVE ${1} ${j} ${i} ${j + randomX} ${i + randomY};`;
            }

            // 1. Try to spawn unit closest to center
            // 2. Try to spawn unit
            function handleSpawn() {
                //find closest controlled tile to center
                const controlledTiles = tiles.filter(tile => tile.owner === 1);
                const closestControlledTile = getClosestTile(centerTile.x, centerTile.y, controlledTiles);
                if (closestControlledTile !== null) {
                    logString += `SPAWN ${1} ${closestControlledTile.x} ${closestControlledTile.y};`;
                    return;
                }

                if (canSpawn === 1) {
                    logString += `SPAWN ${1} ${j} ${i};`;
                }
            }

            function handleBuild() {}

            function updateTileState() {
                const tileIndex = tiles.findIndex(tile => tile.x === j && tile.y === i);
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

    // Write an action using console.log()
    // To debug: console.error('Debug messages...');

    console.log(logString);
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