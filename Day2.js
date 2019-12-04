const data = '1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,1,9,19,1,5,19,23,1,6,23,27,1,27,10,31,1,31,5,35,2,10,35,39,1,9,39,43,1,43,5,47,1,47,6,51,2,51,6,55,1,13,55,59,2,6,59,63,1,63,5,67,2,10,67,71,1,9,71,75,1,75,13,79,1,10,79,83,2,83,13,87,1,87,6,91,1,5,91,95,2,95,9,99,1,5,99,103,1,103,6,107,2,107,13,111,1,111,10,115,2,10,115,119,1,9,119,123,1,123,9,127,1,13,127,131,2,10,131,135,1,135,5,139,1,2,139,143,1,143,5,0,99,2,0,14,0';

const input = data.split(',').map(v => parseInt(v));

input[1] = 12;
input[2] = 2;

const solve = input => {
    let index = 0;

    while(input[index] !== 99 && index <= input.length) {

        const opcode = input[index];

        console.log('Index', index, 'opcode', opcode);

        if(opcode !== 99) {

            const pos1 = input[index+1];
            const pos2 = input[index+2];
            const pos3 = input[index+3];

            console.log('First value at ', pos1, ' : ', input[pos1]);
            console.log('Second value at ', pos2, ' : ', input[pos2]);

            if (opcode === 1) {
                input[pos3] = input[pos1] + input[pos2];
                console.log('Updated value at ', pos3, ' : ', input[pos3]);
            }

            if (opcode === 2) {
                input[pos3] = input[pos1] * input[pos2];
                console.log('Updated value at ', pos3, ' : ', input[pos3]);
            }

            index = index + 4;

            console.log('New index,', index);
        } else {
            console.log('End');
        }
    }

    return input[0];
};

console.log('Result: ', solve(input));