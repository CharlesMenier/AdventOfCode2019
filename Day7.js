const input = '3,8,1001,8,10,8,105,1,0,0,21,46,63,76,97,118,199,280,361,442,99999,3,9,102,4,9,9,101,2,9,9,1002,9,5,9,101,4,9,9,102,2,9,9,4,9,99,3,9,101,5,9,9,102,3,9,9,101,3,9,9,4,9,99,3,9,1001,9,2,9,102,3,9,9,4,9,99,3,9,1002,9,5,9,101,4,9,9,1002,9,3,9,101,2,9,9,4,9,99,3,9,1002,9,5,9,101,3,9,9,1002,9,5,9,1001,9,5,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,99,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,99';

const ACTIONS = {
    ADD: 1,
    MULTIPLY: 2,
    INPUT: 3,
    OUTPUT: 4,
    JUMP_IF_TRUE: 5,
    JUMP_IF_FALSE: 6,
    LESS_THAN: 7,
    EQUALS: 8,
};


const parse = data => data.split(',').map(v => parseInt(v));


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


const getModes = value => ({
    A: !!(Math.floor(value/100) % 10),
    B: !!(Math.floor(value/1000) % 10),
    C: !!(Math.floor(value/10000) % 10),
});

const getIndexes = (input, cursor, modes) => ({
    A: modes.A ? cursor + 1 : input[cursor + 1],
    B: modes.B ? cursor + 2 : input[cursor + 2],
    C: modes.C ? cursor + 3 : input[cursor + 3],
});

let outputs = [];

const computeThruster = (data, phaseSetting, inputSignal) => {
    const inputTmp = [...data];

    let cursor = 0;
    let opcode = 0;

    let hasPhaseSetting = false;

    while(opcode !== 99 && cursor <= inputTmp.length) {

        opcode = inputTmp[cursor] % 100;
        const indexes = getIndexes(inputTmp, cursor, getModes(inputTmp[cursor]));

        switch(opcode) {
            case ACTIONS.ADD:
                inputTmp[indexes.C] = inputTmp[indexes.A] + inputTmp[indexes.B];
                cursor += 4;
                break;
            case ACTIONS.MULTIPLY:
                inputTmp[indexes.C] = inputTmp[indexes.A] * inputTmp[indexes.B];
                cursor += 4;
                break;
            case ACTIONS.INPUT:
                console.log('expecting input');
                if(!hasPhaseSetting) {
                    inputTmp[indexes.A] = phaseSetting;
                    hasPhaseSetting = true;
                } else {
                    inputTmp[indexes.A] = inputSignal;
                }
                cursor += 2;
                break;
            case ACTIONS.OUTPUT:
                console.log('new output', inputTmp[indexes.A]);
                outputs.push(inputTmp[indexes.A]);
                return inputTmp[indexes.A];

            case ACTIONS.JUMP_IF_TRUE:
                if(inputTmp[indexes.A] !== 0) {
                    cursor = inputTmp[indexes.B];
                } else {
                    cursor += 3;
                }
                break;
            case ACTIONS.JUMP_IF_FALSE:
                if(inputTmp[indexes.A] === 0) {
                    cursor = inputTmp[indexes.B];
                } else {
                    cursor += 3;
                }
                break;
            case ACTIONS.LESS_THAN:
                if(inputTmp[indexes.A] < inputTmp[indexes.B]) {
                    inputTmp[indexes.C] = 1;
                } else {
                    inputTmp[indexes.C] = 0;
                }
                cursor += 4;
                break;
            case ACTIONS.EQUALS:
                if(inputTmp[indexes.A] === inputTmp[indexes.B]) {
                    inputTmp[indexes.C] = 1;
                } else {
                    inputTmp[indexes.C] = 0;
                }
                cursor += 4;
                break;
        }
    }
};


const computeMaxThruster = (data, phases) => {

    const sequences = permutations(phases);
    let maxThruster = 0;

    sequences.forEach(sequence => {
        let thruster = 0;

        while(sequence.length) {
            thruster = computeThruster(data, sequence.pop(), thruster);
        }

        if(thruster > maxThruster) {
            maxThruster = thruster;
        }
    });

console.log(outputs);
outputs = [];
   return maxThruster;

};

const computeSequence = (data, sequence) => {
    let thruster = 0;

    while(sequence.length) {
        thruster = computeThruster(data, sequence.pop(), thruster);
        console.log(data);
    }

    console.log(outputs);
    outputs = [];

    return thruster;
};


// Part 1 tests
const testPart1 = () => {

    const phasesPart1 = [0, 1, 2, 3, 4];

    const t1 = '3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0';
    const t2 = '3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0';
    const t3 = '3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0';


    console.log('Result should be 43210 :');
    console.log(computeMaxThruster(parse(t1), phasesPart1));

    console.log('Result should be 54321 :');
    console.log(computeMaxThruster(parse(t2), phasesPart1));

    console.log('Result should be 65210 :');
    console.log(computeMaxThruster(parse(t3), phasesPart1));

    console.log('Part 1 :', computeMaxThruster(parse(input), phasesPart1));

};




// Part 2 tests

const phasesPart2 = [5,6,7,8,9];

const t4 = '3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5';
const t5 = '3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10';

console.log('Result should be 139629729 :');
console.log(computeSequence(parse(t4), [5,6,7,8,9]));

//console.log('Result should be 18216 :');
//console.log(computeSequence(parse(t5), [6,5,8,7,9]));