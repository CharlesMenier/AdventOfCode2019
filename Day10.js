const input = '#.#.##..#.###...##.#....##....###\n' +
    '...#..#.#.##.....#..##.#...###..#\n' +
    '####...#..#.##...#.##..####..#.#.\n' +
    '..#.#..#...#..####.##....#..####.\n' +
    '....##...#.##...#.#.#...#.#..##..\n' +
    '.#....#.##.#.##......#..#..#..#..\n' +
    '.#.......#.....#.....#...###.....\n' +
    '#.#.#.##..#.#...###.#.###....#..#\n' +
    '#.#..........##..###.......#...##\n' +
    '#.#.........##...##.#.##..####..#\n' +
    '###.#..#####...#..#.#...#..#.#...\n' +
    '.##.#.##.........####.#.#...##...\n' +
    '..##...#..###.....#.#...#.#..#.##\n' +
    '.#...#.....#....##...##...###...#\n' +
    '###...#..#....#............#.....\n' +
    '.#####.#......#.......#.#.##..#.#\n' +
    '#.#......#.#.#.#.......##..##..##\n' +
    '.#.##...##..#..##...##...##.....#\n' +
    '#.#...#.#.#.#.#..#...#...##...#.#\n' +
    '##.#..#....#..##.#.#....#.##...##\n' +
    '...###.#.#.......#.#..#..#...#.##\n' +
    '.....##......#.....#..###.....##.\n' +
    '........##..#.#........##.......#\n' +
    '#.##.##...##..###.#....#....###.#\n' +
    '..##.##....##.#..#.##..#.....#...\n' +
    '.#.#....##..###.#...##.#.#.#..#..\n' +
    '..#..##.##.#.##....#...#.........\n' +
    '#...#.#.#....#.......#.#...#..#.#\n' +
    '...###.##.#...#..#...##...##....#\n' +
    '...#..#.#.#..#####...#.#...####.#\n' +
    '##.#...#..##..#..###.#..........#\n' +
    '..........#..##..#..###...#..#...\n' +
    '.#.##...#....##.....#.#...##...##\n';



const t1 = '......#.#.\n' +
    '#..#.#....\n' +
    '..#######.\n' +
    '.#.#.###..\n' +
    '.#..#.....\n' +
    '..#....#.#\n' +
    '#..#....#.\n' +
    '.##.#..###\n' +
    '##...#..#.\n' +
    '.#....####';

const t2 = '#.#...#.#.\n' +
    '.###....#.\n' +
    '.#....#...\n' +
    '##.#.#.#.#\n' +
    '....#.#.#.\n' +
    '.##..###.#\n' +
    '..#...##..\n' +
    '..##....##\n' +
    '......#...\n' +
    '.####.###.';

const t3 = '.#..#..###\n' +
    '####.###.#\n' +
    '....###.#.\n' +
    '..###.##.#\n' +
    '##.##.#.#.\n' +
    '....###..#\n' +
    '..#.#..#.#\n' +
    '#..#.#.###\n' +
    '.##...##.#\n' +
    '.....#.#..';

const t4 = '.#..##.###...#######\n' +
    '##.############..##.\n' +
    '.#.######.########.#\n' +
    '.###.#######.####.#.\n' +
    '#####.##.#.##.###.##\n' +
    '..#####..#.#########\n' +
    '####################\n' +
    '#.####....###.#.#.##\n' +
    '##.#################\n' +
    '#####.##.###..####..\n' +
    '..######..##.#######\n' +
    '####.##.####...##..#\n' +
    '.#####..#.######.###\n' +
    '##...#.##########...\n' +
    '#.##########.#######\n' +
    '.####.#.###.###.#.##\n' +
    '....##.##.###..#####\n' +
    '.#.#.###########.###\n' +
    '#.#.#.#####.####.###\n' +
    '###.##.####.##.#..##';


const parse = data => data
    .split('\n')
    .map(line => line
        .split('')
        .map(a => a === '#')
    );


const getPGCD = (a, b) => (a ? getPGCD(b % a, a) : b);


const findVisibleAsteroids = (asteroids, x, y) => {

    //console.log('\n *** Checking for asteroid at x=', x, 'y=', y, ' *** ');

    // Deep clone array
    const visibleAsteroids = JSON.parse(JSON.stringify(asteroids));

    // Asteroid is visible from another one only if it's the first between the two of them in the trajectory
    visibleAsteroids.forEach((line, j) => {
        line.forEach((isAsteroid, i) => {

            if((x !== i || y !== j) && isAsteroid) {

                //console.log('\nCheck with ', {i, j});

                const pgcd = Math.abs(getPGCD(i - x, j - y));

                let coords = { x: i, y: j };
                const delta = { x: (i - x) / pgcd, y: (j - y) / pgcd };
                let notVisibleCoords = { x: i + delta.x, y: j + delta.y };

                //printCurrentMap(visibleAsteroids, {x, y}, coords);

                // All asteroids after this one in the same line are not visible
                while(
                    (notVisibleCoords.x >= 0 && notVisibleCoords.x <= line.length - 1) &&
                    (notVisibleCoords.y >= 0 && notVisibleCoords.y <= visibleAsteroids.length - 1)
                ) {
                    if(visibleAsteroids[notVisibleCoords.y][notVisibleCoords.x]) {
                        //console.log('Found new not visible asteroid at', notVisibleCoords);
                        //printCurrentMap(visibleAsteroids, {x, y}, notVisibleCoords);
                        visibleAsteroids[notVisibleCoords.y][notVisibleCoords.x] = false;
                    }
                    notVisibleCoords = {x: notVisibleCoords.x + delta.x, y: notVisibleCoords.y + delta.y};
                }

                while (coords.x !== x && coords.y !== y) {
                    // Coords for next asteroid between current and origin
                    const newCoords = { x: coords.x - delta.x, y: coords.y - delta.y };

                    // There is an asteroid at new position and it's not the one we're on
                    if (
                        visibleAsteroids[newCoords.y][newCoords.x] &&
                        newCoords.x !== x && newCoords.y !== y
                    ) {
                        visibleAsteroids[coords.y][coords.x] = false;
                        //console.log('Found new asteroid at', newCoords);
                        //printCurrentMap(visibleAsteroids, {x, y}, newCoords);
                    }

                    coords = {x: coords.x - delta.x, y: coords.y - delta.y};
                }
            }
        });
    });

    //console.log('Found', visibleAsteroids.reduce((acc, val) => acc.concat(val), []).filter(a => a).length);

    return visibleAsteroids.reduce((acc, val) => acc.concat(val), []).filter(a => a).length - 1;

};


const findMaxVisibleAsteroids = asteroids => {

    let max = 0;

    asteroids.forEach((line, y) => {
        line.forEach((isAsteroid, x) => {
            if(isAsteroid) {
                const visible = findVisibleAsteroids(asteroids, x, y);
                if(visible > max) {
                    max = visible;
                }
            }
        });
    });

    return max;
};


const printCurrentMap = (asteroids, current, coords) => {

    asteroids.forEach((line, y) => {
        let visual = '';
        line.forEach((a, x) => {

            // Current asteroid we're checking the visible for
            if (current.x === x && current.y === y) {
                visual += '(O)';
            } else if (!a) {
                // No asteroid at position
                visual += ' . ';
            } else {
                if (coords.x === x && coords.y === y) {
                    // The current position we're checking
                    visual += '(X)';
                } else {
                    // Standard asteroid
                    visual += ' # ';
                }
            }
        });
        console.log(visual.normalize());
    })

};

const testPart1 = () => {

    //console.log('Should output 33 : ', findMaxVisibleAsteroids(parse(t1)));
    //console.log('Should output 35 : ', findMaxVisibleAsteroids(parse(t2)));
    //console.log('Should output 41 : ', findMaxVisibleAsteroids(parse(t3)));
    //console.log('Should output 210 : ', findMaxVisibleAsteroids(parse(t4)));

    console.log('Part 1:', findMaxVisibleAsteroids(parse(input)));
};

testPart1();