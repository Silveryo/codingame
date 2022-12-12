/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

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

interface TileToControl {
    x: number;
    y: number;
    isAssigned: boolean;
}

//TODO: MOVE ALL MY UNITS
//TODO: KEEP SPAWNING
//FIXME: recycler

let center:[width: number, height: number, scrapAmount: number] = [Math.round(width/2), Math.round(height/2), 69];


let unownedTiles: TileToControl[] = [];
let closestControlledToCenterTile: Tile | null = null;

// game loop
while (true) {
    var inputs: string[] = readline().split(' ');
    const myMatter: number = parseInt(inputs[0]);
    const oppMatter: number = parseInt(inputs[1]);
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            //reset assigned unownedTiles
            unownedTiles = unownedTiles.map(tile => ({ ...tile, isAssigned: false }));
               
            var inputs: string[] = readline().split(' ');
            const scrapAmount: number = parseInt(inputs[0]);
            const owner: number = parseInt(inputs[1]); // 1 = me, 0 = foe, -1 = neutral
            const units: number = parseInt(inputs[2]);
            const recycler: number = parseInt(inputs[3]);
            const canBuild: number = parseInt(inputs[4]);
            const canSpawn: number = parseInt(inputs[5]);
            const inRangeOfRecycler: number = parseInt(inputs[6]);

            const centerOwner = (j === center[0] && i === center[1]) ? owner : -1;

            if (owner !== 1 && scrapAmount > 0) {
                unownedTiles.push({ x: j, y: i, isAssigned: false });        
            }
            //THE CENTER IS MINE

            const getClosestTile = (x: number, y: number, tiles: Tile[]) => {
                return tiles.reduce((prev, curr) => {
                    const prevDistance = Math.sqrt(Math.pow(prev.x - x, 2) + Math.pow(prev.y - y, 2));
                    const currDistance = Math.sqrt(Math.pow(curr.x - x, 2) + Math.pow(curr.y - y, 2));
                    return prevDistance < currDistance ? prev : curr;
                });
            } // I DID-§$ß IT .. now to use it....

            //update center.scrapAmount
            if (j === center[0] && i === center[1]) {
                center[2] = scrapAmount;
            }

            //set closest controlled tile to center
            if (owner === 1 && !closestControlledToCenterTile) {
                closestControlledToCenterTile = { x: j, y: i, scrapAmount, owner, units, recycler, canBuild, canSpawn, inRangeOfRecycler };
            } else if (owner === 1 && closestControlledToCenterTile) {
                const prevDistance = Math.sqrt(Math.pow(closestControlledToCenterTile.x - center[0], 2) + Math.pow(closestControlledToCenterTile.y - center[1], 2));
                const currDistance = Math.sqrt(Math.pow(j - center[0], 2) + Math.pow(i - center[1], 2));
                if (prevDistance > currDistance) {
                    closestControlledToCenterTile = { x: j, y: i, scrapAmount, owner, units, recycler, canBuild, canSpawn, inRangeOfRecycler };
                }
            }

            //find first unassigned tile <<KEEP FOR NOW
            const unassignedTile = unownedTiles.find(tile => tile.isAssigned === false);
            // if (unassignedTile && units > 0) {
            //     logString += `MOVE ${eHHHHxx1} ${j} ${i} ${unassignedTile.x} ${unassignedTile.y};`;
            //     unassignedTile.isAssigned = true;
            // }

            //find first closest unassigned tile
            if (unownedTiles.length > 0) { 
                const closestUnassignedTile = unownedTiles.reduce((prev, curr) => {
                    const prevDistance = Math.sqrt(Math.pow(prev.x - j, 2) + Math.pow(prev.y - i, 2));
                    const currDistance = Math.sqrt(Math.pow(curr.x - j, 2) + Math.pow(curr.y - i, 2));
                    return prevDistance < currDistance ? prev : curr;
                });
                if (closestUnassignedTile && units > 0) {
                    console.error('closestUnassignedTile: setting move command')
                    logString += `MOVE ${1} ${j} ${i} ${closestUnassignedTile.x} ${closestUnassignedTile.y};`;
                    unownedTiles = unownedTiles.map(tile => {
                        if (tile.x === closestUnassignedTile.x && tile.y === closestUnassignedTile.y) {
                            return { ...tile, isAssigned: true }
                        }
                        return tile;
                    });
                    //remove tile from unownedTiles
                    unownedTiles = unownedTiles.filter(tile => tile.x !== closestUnassignedTile.x && tile.y !== closestUnassignedTile.y);
                }
                
            }
                
            // Develop your pieces, control the center!
            if (logString.indexOf('MOVE') === -1 && units > 0) {
                console.error('noMoveHasBeenSet');
                if (centerOwner !== 1 && center[2] > 0) { // increase the minimum scrap amount to be safe and not suicide bots ??: maybe 
                logString += `MOVE ${1} ${j} ${i} ${center[0]} ${center[1]};`;
                //else move randomly by 1 tile
                } else {
                    const randomX = Math.floor(Math.random() * 3) - 1;
                    const randomY = Math.floor(Math.random() * 3) - 1;
                    logString += `MOVE ${1} ${j} ${i} ${j + randomX} ${i + randomY};`;
                }
            }



            // SPAWNIN HANDLED HERE !!! <<<<<<<

            // try to spawn closest to closestControlledToCenterTile
            if (closestControlledToCenterTile && canSpawn) {
                logString += `SPAWN 1 ${closestControlledToCenterTile.x} ${closestControlledToCenterTile.y};`;
            }

            // in case of bad code
            if (logString.indexOf('SPAWN') === -1 && canSpawn) {
                logString += `SPAWN 1 ${j} ${i};`;
            }

        }
    }

    // Write an action using console.log()
    // To debug: console.error('Debug messages...');

    console.log(logString);
}