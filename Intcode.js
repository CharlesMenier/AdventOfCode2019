const isDebug = false;

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

const MODES = {
    POSITION: 0,
    IMMEDIATE: 1,
};

// Add 0 if to program until program.length is = pos
//const expandMemory = (program, pos) => pos >= program.length && program.push(...[...'0'.repeat(pos - program.length + 1)].map(Number));

const getAtAddress = (program, pos) => program[pos];

const setAtAddress = (program, mode, pos, value) => program[pos] = value;

const getNum = (program, mode, num) => mode === MODES.IMMEDIATE ? num : getAtAddress(program, num);

const OPERATIONS = {
    [ACTIONS.ADD]: {
        fn: (program, [mode1, mode2, modeAddress], num1, num2, address) => {
            debug('ADD AT', address, '(' + program[address] + ')', '->', num1, '(' + getNum(program, mode1, num1) + ') + ', num2, '(' + getNum(program, mode2, num2) + ')');

            const res = setAtAddress(
                program,
                modeAddress,
                address,
                getNum(program, mode1, num1) + getNum(program, mode2, num2)
            );

            debug(program.join(','), '\n');

            return res;
        },
        params: 3
    },
    [ACTIONS.MULTIPLY]: {
        fn: (program, [mode1, mode2, modeAddress], num1, num2, address) => {
            debug('MULTIPLY AT', address, '(' + program[address] + ')', '->', num1, '(' + getNum(program, mode1, num1) + ') * ', num2, '(' + getNum(program, mode2, num2) + ')');

            const res = setAtAddress(
                program,
                modeAddress,
                address,
                getNum(program, mode1, num1) * getNum(program, mode2, num2)
            );

            debug(program.join(','), '\n');

            return res;
        },
        params: 3
    },
    [ACTIONS.INPUT]: {
        fn: (program, [modeAddress], address, input) => {
            debug('-> ', input[0]);
            return setAtAddress(program, modeAddress, address, input.shift());
        },
        params: 1,
        input: true
    },
    [ACTIONS.OUTPUT]: {
        fn: (program, [mode], num) => {
            debug('OUTPUT ->', num, '(' + getNum(program, mode, num) + ')');
            return getNum(program, mode, num);
        },
        params: 1,
        output: true
    },
    [ACTIONS.JUMP_IF_TRUE]: {
        fn: (program, [mode1, mode2], num1, num2) => {
            debug('JUMP IF TRUE ->', num1, '(' + getNum(program, mode1, num1) + ')', num2, '(' + getNum(program, mode2, num2) + ')');
            return getNum(program, mode1, num1) !== 0 ? getNum(program, mode2, num2) : null;
        },
        params: 2,
        flow: true
    },
    [ACTIONS.JUMP_IF_FALSE]: {
        fn: (program, [mode1, mode2], num1, num2) => {
            debug('JUMP IF FALSE ->', num1, '(' + getNum(program, mode1, num1) + ')', num2, '(' + getNum(program, mode2, num2) + ')');
            return getNum(program, mode1, num1) === 0 ? getNum(program, mode2, num2) : null;
        },
        params: 2,
        flow: true
    },
    [ACTIONS.LESS_THAN]: {
        fn: (program, [mode1, mode2, modeAddress], num1, num2, address) => {
            debug('LESS THAN AT', address, '(' + program[address] + ')', '->', num1, '(' + getNum(program, mode1, num1) + ') < ', num2, '(' + getNum(program, mode2, num2) + ')');
            return setAtAddress(
                program,
                modeAddress,
                address,
                getNum(program, mode1, num1) < getNum(program, mode2, num2) ? 1 : 0
            );
        },
        params: 3
    },
    [ACTIONS.EQUALS]: {
        fn: (program, [mode1, mode2, modeAddress], num1, num2, address) => {
            debug('EQUALS AT', address, '(' + program[address] + ')', '->', num1, '(' + getNum(program, mode1, num1) + ') < ', num2, '(' + getNum(program, mode2, num2) + ')');
            return setAtAddress(
                program,
                modeAddress,
                address,
                getNum(program, mode1, num1) === getNum(program, mode2, num2) ? 1 : 0
            );
        },
        params: 3
    }
};

const readOp = code =>
    code
        .toString()
        .padStart(5, '0')
        .match(/(\d)(\d)(\d)(\d\d)/u)
        .slice(1)
        .map(Number)
        .reverse();


const printCurrentProgram = (program, pos) => {

    let size = 0;

    program.forEach((instruction, i) => {
        if(i < pos) {
            size += instruction.toString().length;
        }
    });

    if(pos + size === 0) {
        debug('v');
    } else {
        debug(' '.repeat(pos + size - 1), 'v');
    }

    debug(program.join(','));

};

function* compute(program, ...input) {

    debug('START WITH INPUTS', input);

    let cursor = 0;

    while (program[cursor] !== 99) {

        const [opCode, ...modes] = readOp(program[cursor]);

        // Params are right after op code (n+1)
        const params = program.slice(cursor + 1, cursor + 1 + OPERATIONS[opCode].params);

        printCurrentProgram(program, cursor);

        if (OPERATIONS[opCode].input) {
            debug('WAITING INPUT\n');
            const inp = yield;

            if (inp != null) {
                input = Array.isArray(inp) ? inp : [inp];
                debug('INPUT FROM PREVIOUS THRUSTER ', input);
            }
        }

        const result = OPERATIONS[opCode].fn(program, modes, ...params, input);

        if (OPERATIONS[opCode].output) {
            yield result;
            debug('OUTPUT DONE', result);
        }

        cursor = OPERATIONS[opCode].flow && result != null ? result : cursor + 1 + OPERATIONS[opCode].params;
    }
}

const debug = (...params) => {
    if(isDebug) {
        console.log(params);
    }
};


exports.compute = compute;