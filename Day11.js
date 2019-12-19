const Intcode = require('./Intcode');

const input = '3,8,1005,8,302,1106,0,11,0,0,0,104,1,104,0,3,8,102,-1,8,10,101,1,10,10,4,10,1008,8,0,10,4,10,101,0,8,29,1006,0,78,2,1007,9,10,3,8,1002,8,-1,10,1001,10,1,10,4,10,1008,8,1,10,4,10,1002,8,1,58,1006,0,7,3,8,1002,8,-1,10,101,1,10,10,4,10,1008,8,0,10,4,10,1002,8,1,83,2,1009,4,10,3,8,102,-1,8,10,1001,10,1,10,4,10,1008,8,0,10,4,10,1002,8,1,109,1,106,11,10,1006,0,16,3,8,1002,8,-1,10,1001,10,1,10,4,10,1008,8,1,10,4,10,102,1,8,138,2,108,0,10,1,101,14,10,1,1109,1,10,3,8,1002,8,-1,10,101,1,10,10,4,10,1008,8,0,10,4,10,102,1,8,172,2,3,10,10,1006,0,49,3,8,1002,8,-1,10,101,1,10,10,4,10,1008,8,1,10,4,10,1001,8,0,201,1006,0,28,2,3,15,10,2,109,12,10,3,8,1002,8,-1,10,1001,10,1,10,4,10,108,0,8,10,4,10,1001,8,0,233,3,8,102,-1,8,10,1001,10,1,10,4,10,108,1,8,10,4,10,101,0,8,255,3,8,1002,8,-1,10,1001,10,1,10,4,10,108,1,8,10,4,10,102,1,8,277,2,1107,9,10,101,1,9,9,1007,9,946,10,1005,10,15,99,109,624,104,0,104,1,21101,0,932856042280,1,21101,0,319,0,1105,1,423,21101,0,387512640296,1,21101,330,0,0,1106,0,423,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,21101,0,46266346499,1,21102,1,377,0,1105,1,423,21102,1,46211836967,1,21102,1,388,0,1105,1,423,3,10,104,0,104,0,3,10,104,0,104,0,21102,1,825460941588,1,21102,411,1,0,1106,0,423,21101,709475738388,0,1,21102,1,422,0,1105,1,423,99,109,2,21201,-1,0,1,21101,0,40,2,21102,454,1,3,21101,0,444,0,1106,0,487,109,-2,2106,0,0,0,1,0,0,1,109,2,3,10,204,-1,1001,449,450,465,4,0,1001,449,1,449,108,4,449,10,1006,10,481,1102,1,0,449,109,-2,2106,0,0,0,109,4,2102,1,-1,486,1207,-3,0,10,1006,10,504,21101,0,0,-3,22101,0,-3,1,21201,-2,0,2,21102,1,1,3,21102,1,523,0,1105,1,528,109,-4,2105,1,0,109,5,1207,-3,1,10,1006,10,551,2207,-4,-2,10,1006,10,551,22101,0,-4,-4,1105,1,619,22102,1,-4,1,21201,-3,-1,2,21202,-2,2,3,21101,570,0,0,1106,0,528,22102,1,1,-4,21102,1,1,-1,2207,-4,-2,10,1006,10,589,21101,0,0,-1,22202,-2,-1,-2,2107,0,-3,10,1006,10,611,21201,-1,0,1,21101,611,0,0,106,0,486,21202,-2,-1,-2,22201,-4,-2,-4,109,-5,2105,1,0';

const parse = data => data.split(',').map(Number);

const DIRECTIONS = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
};

const getNextDirection = (currentDirection, rotation) => {
    switch(currentDirection) {
        case DIRECTIONS.UP: return rotation ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
        case DIRECTIONS.RIGHT: return rotation ? DIRECTIONS.DOWN : DIRECTIONS.UP;
        case DIRECTIONS.DOWN: return rotation ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT;
        case DIRECTIONS.LEFT: return rotation ? DIRECTIONS.UP : DIRECTIONS.DOWN;
    }
};

const getNextPosition = (currentPosition, direction) => {
    switch(direction) {
        case DIRECTIONS.UP: return { ...currentPosition, y: currentPosition.y + 1 };
        case DIRECTIONS.RIGHT: return { ...currentPosition, x: currentPosition.x + 1 };
        case DIRECTIONS.DOWN: return { ...currentPosition, y: currentPosition.y - 1 };
        case DIRECTIONS.LEFT: return { ...currentPosition, x: currentPosition.x - 1 };
    }
};

const findRobotPath = (program) => {

    const computer = Intcode.compute(program, 0);

    let done;
    let value;

    let dir = DIRECTIONS.UP;
    let pos = { x: 0, y: 0 };
    let path = [];

    let inp;
    let outputs = [];

    while(!done) {

        ({done, value} = computer.next(inp));

        if(value != null) {
            outputs.push(value);
        }

        if(outputs.length === 2) {
            [color, rotation] = outputs;

            path.push({...pos, color});

            dir = getNextDirection(dir, rotation);
            pos = getNextPosition(pos, dir);
            inp = (path.find(p => p.x === pos.x && p.y === pos.y) || {color: 0}).color;

            outputs = [];

            printRobotPath(path);
        }
    }

    return path;

};

const printRobotPath = path => {
    const maxX = path.reduce((max, pos) => pos.x > max ? pos.x : max, 0);
    const maxY = path.reduce((max, pos) => pos.y > max ? pos.y : max, 0);
    const minX = path.reduce((min, pos) => pos.x < min ? pos.x : min, 999);
    const minY = path.reduce((min, pos) => pos.y < min ? pos.y : min, 999);

    const deltaX = Math.abs(minX);
    const deltaY = Math.abs(minY);

    console.log('ORIGIN IS (', minX, ',', minY, ')');

    let visiblePath = new Array(
        deltaY + Math.abs(maxY) + 1
    ).fill(new Array(deltaX + Math.abs(maxX) + 1).fill(0));

    path.forEach(pos => {
        console.log('\n', pos);
        console.log('before\n', visiblePath.join('\n'));
        visiblePath[pos.y + deltaY][pos.x + deltaX] = visiblePath[pos.y + deltaY][pos.x + deltaX] + 1;
        console.log('after\n', visiblePath.join('\n'));
    });

    //visiblePath.forEach(l => console.log(l.join(' ')));
};


const part1 = () => {
    console.log('Part1: ', findRobotPath(parse(input)).length/*.map(o => `${o.x}${o.y}${o.color}`)*/);
};

part1();