const isDebug = true;

const ACTIONS = {
    ADD: 1,
    MULTIPLY: 2,
    INPUT: 3,
    OUTPUT: 4,
    JUMP_IF_TRUE: 5,
    JUMP_IF_FALSE: 6,
    LESS_THAN: 7,
    EQUALS: 8,
    OFFSET_BASE: 9,
};

const MODES = {
    POSITION: 0,
    IMMEDIATE: 1,
    RELATIVE: 2,
};



// Add 0 if to program until program.length is = pos
const initMemory = (program, pos) => {
    if(pos >= program.length) {
        program.push(...[...'0'.repeat(pos - program.length + 1)].map(Number));
    }
};

const getAtAddress = (program, mode, pos) => {
    if(mode === MODES.POSITION || mode === MODES.RELATIVE) {
        // Make sure the wanted memory address is available
        initMemory(program, pos);
    }

    return program[pos];
};

const setAtAddress = (program, base, mode, pos, value) => {
    switch(mode) {
        case MODES.POSITION: return program[pos] = value;
        case MODES.RELATIVE: return program[pos + base] = value;
        default: debug('[setAtAddress] Unrecognized mode :', mode);
    }
};

const getNum = (program, base, mode, num) => {
    switch(mode) {
        case MODES.IMMEDIATE: return num;
        case MODES.POSITION: return getAtAddress(program, mode, num);
        case MODES.RELATIVE: return getAtAddress(program, mode, num + base);
        default: debug('[getNum] Unrecognized mode :', mode);
    }
};

const OPERATIONS = {
    [ACTIONS.ADD]: {
        fn: (
            program,
            base,
            [mode1, mode2, modeAddress],
            num1,
            num2,
            address
        ) => {
            debug('ADD AT', address, '(' + program[address] + ')', '->', num1, '(' + getNum(program, base, mode1, num1) + ') + ', num2, '(' + getNum(program, base, mode2, num2) + ')');

            const res = setAtAddress(
                program,
                base,
                modeAddress,
                address,
                getNum(program, base, mode1, num1) + getNum(program, base, mode2, num2)
            );

            debug(program.join(','), '\n');

            return res;
        },
        params: 3
    },
    [ACTIONS.MULTIPLY]: {
        fn: (
            program,
            base,
            [mode1, mode2, modeAddress],
            num1,
            num2,
            address
        ) => {
            debug('MULTIPLY AT', address, '(' + program[address] + ')', '->', num1, '(' + getNum(program, base, mode1, num1) + ') * ', num2, '(' + getNum(program, base, mode2, num2) + ')');

            const res = setAtAddress(
                program,
                base,
                modeAddress,
                address,
                getNum(program, base, mode1, num1) * getNum(program, base, mode2, num2)
            );

            debug(program.join(','), '\n');

            return res;
        },
        params: 3
    },
    [ACTIONS.INPUT]: {
        fn: (
            program,
            base,
            [modeAddress],
            address,
            input
        ) => {
            debug('-> ', input[0]);
            return setAtAddress(program, base, modeAddress, address, input.shift());
        },
        params: 1,
    },
    [ACTIONS.OUTPUT]: {
        fn: (
            program,
            base,
            [mode],
            num
        ) => {
            debug('OUTPUT ->', num, '(' + getNum(program, base, mode, num) + ')');
            return getNum(program, base, mode, num);
        },
        params: 1,
    },
    [ACTIONS.JUMP_IF_TRUE]: {
        fn: (
            program,
            base,
            [mode1, mode2],
            num1,
            num2
        ) => {
            debug('JUMP IF TRUE ->', num1, '(' + getNum(program, base, mode1, num1) + ')', num2, '(' + getNum(program, base, mode2, num2) + ')');
            return getNum(program, base, mode1, num1) !== 0 ? getNum(program, base, mode2, num2) : null;
        },
        params: 2,
        flow: true
    },
    [ACTIONS.JUMP_IF_FALSE]: {
        fn: (
            program,
            base,
            [mode1, mode2],
            num1,
            num2
        ) => {
            debug('JUMP IF FALSE ->', num1, '(' + getNum(program, base, mode1, num1) + ')', num2, '(' + getNum(program, base, mode2, num2) + ')');
            return getNum(program, base, mode1, num1) === 0 ? getNum(program, base, mode2, num2) : null;
        },
        params: 2,
        flow: true
    },
    [ACTIONS.LESS_THAN]: {
        fn: (
            program,
            base,
            [mode1, mode2, modeAddress],
            num1,
            num2,
            address
        ) => {
            debug('LESS THAN AT', address, '(' + program[address] + ')', '->', num1, '(' + getNum(program, base, mode1, num1) + ') < ', num2, '(' + getNum(program, base, mode2, num2) + ')');
            return setAtAddress(
                program,
                base,
                modeAddress,
                address,
                getNum(program, base, mode1, num1) < getNum(program, base, mode2, num2) ? 1 : 0
            );
        },
        params: 3
    },
    [ACTIONS.EQUALS]: {
        fn: (
            program,
            base,
            [mode1, mode2, modeAddress],
            num1,
            num2,
            address
        ) => {
            debug('EQUALS AT', address, '(' + program[address] + ')', '->', num1, '(' + getNum(program, base, mode1, num1) + ') = ', num2, '(' + getNum(program, base, mode2, num2) + ')');
            return setAtAddress(
                program,
                base,
                modeAddress,
                address,
                getNum(program, base, mode1, num1) === getNum(program, base, mode2, num2) ? 1 : 0
            );
        },
        params: 3
    },
    [ACTIONS.OFFSET_BASE]: {
        fn: (
            program,
            base,
            [mode],
            num
        ) => {
            debug('OFFSET BASE BY ->', num, '(' + getNum(program, base, mode, num) + ')');
            return base + getNum(program, base, mode, num);
        },
        params: 1,
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
    if(isDebug) {

        let size = 0;

        program.forEach((instruction, i) => {
            if (i < pos) {
                size += instruction.toString().length;
            }
        });

        if (pos + size === 0) {
            debug('v');
        } else {
            debug(' '.repeat(pos + size - 1), 'v');
        }

        debug(program.join(','));
    }
};

function* compute(program, ...input) {

    debug('START WITH INPUTS', input);

    let relativeBase = 0;
    let cursor = 0;

    while (program[cursor] !== 99) {

        const [opCode, ...modes] = readOp(program[cursor]);

        // Params are right after op code (n+1)
        const params = program.slice(cursor + 1, cursor + 1 + OPERATIONS[opCode].params);

        printCurrentProgram(program, cursor);

        if (opCode === ACTIONS.INPUT) {
            debug('WAITING INPUT\n');
            const inp = yield;

            if (inp != null) {
                input = Array.isArray(inp) ? inp : [inp];
                debug('INPUT FROM PREVIOUS THRUSTER ', input);
            }
        }

        const result = OPERATIONS[opCode].fn(program, relativeBase, modes, ...params, input);

        if (opCode === ACTIONS.OUTPUT) {
            yield result;
            debug('OUTPUT DONE', result);
        }

        if(opCode === ACTIONS.OFFSET_BASE) {
            relativeBase = result;
        }

        cursor = OPERATIONS[opCode].flow && result != null ? result : cursor + 1 + OPERATIONS[opCode].params;
    }
}

const debug = (...params) => {
    if(isDebug) {
        console.log(...params);
    }
};


exports.compute = compute;