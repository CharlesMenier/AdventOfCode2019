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


const findNumberOfVisibleAsteroid = (asteroids, x, y) => {

    //console.log('\n *** Checking for asteroid at x=', x, 'y=', y, ' *** ');

    // Deep clone array
    const visibleAsteroids = JSON.parse(JSON.stringify(asteroids));

    //console.log(visibleAsteroids);

    // Asteroid is visible from another one only if it's the first between the two of them in the trajectory
    for(let j = 0; j < asteroids.length; j++) {
        for(let i = 0; i < asteroids[j].length; i++) {

            if(x !== i && y !== j) {

                if (asteroids[j][i]) {

                    //console.log('\nCheck between ', {i, j});

                    const pgcd = Math.abs(getPGCD(i - x, j - y));

                    let coords = {x: i, y: j};
                    const delta = {x: (i - x) / pgcd, y: (j - y) / pgcd};

                    while (coords.x !== x && coords.y !== y) {
                        //console.log('Found new coords between them', coords);

                        if (visibleAsteroids[coords.y - delta.y][coords.x - delta.x]) {
                            visibleAsteroids[coords.y - delta.y][coords.x - delta.x] = false;
                        }

                        coords = {x: coords.x - delta.x, y: coords.y - delta.y};
                    }

                }
            }
        }
    }

    //console.log('Found', visibleAsteroids.reduce((acc, val) => acc.concat(val), []).filter(a => a).length + 1);

    return visibleAsteroids.reduce((acc, val) => acc.concat(val), []).filter(a => a).length + 1;

};


const findMaxDetectedAsteroids = asteroids => {

    let max = 0;

    for(let y = 0; y < asteroids.length; y++) {
        for(let x = 0; x < asteroids[y].length; x++) {

            if(asteroids[y][x]) {

                const visible = findNumberOfVisibleAsteroid(asteroids.slice(), x, y);
                if(visible > max) {
                    max = visible;
                }
            }
        }
    }

    return max;
};

const testPart1 = () => {

    console.log('Should output 33 : ', findMaxDetectedAsteroids(parse(t1)));
    console.log('Should output 35 : ', findMaxDetectedAsteroids(parse(t2)));
    //console.log('Should output 41 : ', findMaxDetectedAsteroids(parse(t3)));
    //console.log('Should output 210 : ', findMaxDetectedAsteroids(parse(t4)));

};

testPart1();