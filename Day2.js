const data = '1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,1,9,19,1,5,19,23,1,6,23,27,1,27,10,31,1,31,5,35,2,10,35,39,1,9,39,43,1,43,5,47,1,47,6,51,2,51,6,55,1,13,55,59,2,6,59,63,1,63,5,67,2,10,67,71,1,9,71,75,1,75,13,79,1,10,79,83,2,83,13,87,1,87,6,91,1,5,91,95,2,95,9,99,1,5,99,103,1,103,6,107,2,107,13,111,1,111,10,115,2,10,115,119,1,9,119,123,1,123,9,127,1,13,127,131,2,10,131,135,1,135,5,139,1,2,139,143,1,143,5,0,99,2,0,14,0';

const input = data.split(',').map(v => parseInt(v));

const solve = (noun, verb) => {
    const inputTmp = [...input];
    inputTmp[1] = noun;
    inputTmp[2] = verb;
    let index = 0;

    while(inputTmp[index] !== 99 && index <= inputTmp.length) {
        const opcode = inputTmp[index];

        if(opcode !== 99) {
            const pos1 = inputTmp[index+1];
            const pos2 = inputTmp[index+2];
            const pos3 = inputTmp[index+3];
            if (opcode === 1) {
                inputTmp[pos3] = inputTmp[pos1] + inputTmp[pos2];
            }
            if (opcode === 2) {
                inputTmp[pos3] = inputTmp[pos1] * inputTmp[pos2];
            }
            index = index + 4;
        }
    }
    return inputTmp[0];
};

const compute = () => {
    for(let i = 0; i <= 99; i++) {
        for(let j = 0; j <= 99; j++) {
            if(solve(i, j) === 19690720) {
                return 100 * i + j;
            }
        }
    }
};

console.log('Result PART 1: ', solve(12, 2));
console.log('Result PART 2: ', compute());