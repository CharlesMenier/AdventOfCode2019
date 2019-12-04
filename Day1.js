/*
Fuel required to launch a given module is based on its mass.
Specifically, to find the fuel required for a module, take its mass, divide by three, round down, and subtract 2.
 */

const input = [142388, 128965, 137791, 93517, 98732, 83948, 64037, 124603, 61093, 132020, 99227, 73227, 75536, 53249, 149300, 75975, 146023, 117855, 105380, 127149, 146894, 73257, 69233, 67090, 87932, 107473, 127873, 132999, 139324, 92861, 83651, 91064, 137074, 94188, 96969, 96592, 116019, 52969, 125456, 97428, 112642, 99901, 89405, 91983, 56445, 64917, 72393, 127679, 122430, 142036, 87228, 118322, 51965, 67787, 130183, 124044, 101324, 107800, 85585, 67886, 140772, 138280, 73183, 116096, 79239, 105958, 92719, 70896, 115279, 51912, 74396, 75121, 131819, 67970, 96436, 107074, 135588, 97510, 57877, 114504, 50521, 100144, 67840, 51319, 73801, 128333, 123521, 105916, 92601, 146340, 135355, 51461, 95648, 92635, 126711, 75717, 136114, 106814, 89913, 119734];

const getFuelCost = value => Math.floor(value/3) - 2;

const getRecursiveCost = value => {
    const cost = getFuelCost(value);
    return cost > 0 ? cost + getRecursiveCost(cost) : 0;
};

console.log('Result part 1: ', input.reduce((acc, curr) => acc + getFuelCost(curr), 0));
console.log('Result part 2: ', input.reduce((acc, curr) => acc + getRecursiveCost(curr), 0));