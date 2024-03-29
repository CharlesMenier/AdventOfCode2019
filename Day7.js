const Intcode = require('./Intcode');

const input = '3,8,1001,8,10,8,105,1,0,0,21,46,63,76,97,118,199,280,361,442,99999,3,9,102,4,9,9,101,2,9,9,1002,9,5,9,101,4,9,9,102,2,9,9,4,9,99,3,9,101,5,9,9,102,3,9,9,101,3,9,9,4,9,99,3,9,1001,9,2,9,102,3,9,9,4,9,99,3,9,1002,9,5,9,101,4,9,9,1002,9,3,9,101,2,9,9,4,9,99,3,9,1002,9,5,9,101,3,9,9,1002,9,5,9,1001,9,5,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,99,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,99';

const parse = data => data.split(',').map(Number);


const permutations = a => {
    let ret = [];

    for (let i = 0; i < a.length; i = i + 1) {
        let rest = permutations(a.slice(0, i).concat(a.slice(i + 1)));

        if(!rest.length) {
            ret.push([a[i]])
        } else {
            for(let j = 0; j < rest.length; j = j + 1) {
                ret.push([a[i]].concat(rest[j]))
            }
        }
    }
    return ret;
};


const computeThruster = (program, sequence) => {
    let result = 0;
    sequence.forEach(setting => result = [...Intcode.compute(program, setting, result)].pop());
    return result;
};


const computeMaxThruster = (program, phases) => {
    const sequences = permutations(phases);
    const results = sequences.map(s => computeThruster(program, s));
    return Math.max(...results);
};


const computeThrusterFeedback = (program, sequence) => {
    let done, value;
    let i = 0;
    let result;

    // Create generators
    const thrusters = sequence.map(n => Intcode.compute(program.slice(), n, 0));

    while(!done) {
        //console.log('\n[*** THRUSTER :', 'n°', i % thrusters.length, ' ***] : ', result);

        ({value, done} = thrusters[i % thrusters.length].next(result));

        if(value != null) {
            result = value;
        }

        i++;
    }

    return result;

};


const computeMaxThrusterWithFeedback = (program, phases) => {

    const sequences = permutations(phases);

    const results = sequences.map(s => computeThrusterFeedback(program, s));

    return Math.max(...results);
};


// Part 1 tests
const testPart1 = () => {

    const phasesPart1 = [0, 1, 2, 3, 4];

    const t1 = '3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0';
    const t2 = '3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0';
    const t3 = '3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0';


    console.log('Result should be 43210 :', computeMaxThruster(parse(t1), phasesPart1));
    console.log('Result should be 54321 :', computeMaxThruster(parse(t2), phasesPart1));
    console.log('Result should be 65210 :', computeMaxThruster(parse(t3), phasesPart1));

    console.log('\nPart 1 :', computeMaxThruster(parse(input), phasesPart1));

};



// Part 2 tests
const testPart2 = () => {
    const phasesPart2 = [5, 6, 7, 8, 9];

    const t4 = '3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5';
    const t5 = '3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10';

    console.log('Result should be 139629729 :', computeThrusterFeedback(parse(t4), [9,8,7,6,5]));
    console.log('Result should be 18216 :', computeThrusterFeedback(parse(t5), [9,7,8,5,6]));

    console.log('\nPart 2 :', computeMaxThrusterWithFeedback(parse(input), phasesPart2));
};

//testPart1();
testPart2();