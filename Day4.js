/*
It is a six-digit number.
The value is within the range given in your puzzle input.
Two adjacent digits are the same (like 22 in 122345).
Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).
 */

// PART 1
const lowerBound = 197487;
const upperBound = 673251;

let count = 0;

const isOnlyIncreasing = number => {
    for(let curr= 1, prev = curr-1; curr < number.length; curr++, prev++) {
        if(number[prev] > number[curr]) {
            return false;
        }
    }
    return true;
};

const hasDouble = number => number.match(/.*(11|22|33|44|55|66|77|88|99).*/g) !== null;
const hasZero = number => number.match(/.*0.*/g) !== null;

for(let i = lowerBound; i < upperBound; i++) {

    const stringNumber = i.toString();

    if(!hasZero(stringNumber)) {
        if (hasDouble(stringNumber) && isOnlyIncreasing(stringNumber)) {
            ++count;
        }
    }
}

console.log('Potential codes : ', count);