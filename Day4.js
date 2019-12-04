/*
It is a six-digit number.
The value is within the range given in your puzzle input.
Two adjacent digits are the same (like 22 in 122345).
Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).
 */

const lowerBound = 197487;
const upperBound = 673251;

const isOnlyIncreasing = number => {
    for(let curr= 1, prev = curr-1; curr < number.length; curr++, prev++) {
        if(number[prev] > number[curr]) {
            return false;
        }
    }
    return true;
};

const hasDouble = number => number.match(/.*(11|22|33|44|55|66|77|88|99).*/g) !== null;

const hasExactDouble = number => {

    let double = false;

    for(let curr= 1, prev = curr-1; curr < number.length; curr++, prev++) {
        if(double) {
            if(number[prev] !== number[curr]) {
                return true;
            } else {
                while(number[prev] === number[curr]) {
                    ++curr;
                    ++prev;
                }
                double = false;
            }
        } else if(number[prev] === number[curr]) {
            double = true;
        }
    }
    return double;
};

const hasZero = number => number.match(/\d+0.*/g) !== null;

const findCodes = (lower, upper, doubleMatcher) => {
    let count = 0;

    for(let i = lower; i < upper; i++) {

        const stringNumber = i.toString();

        if(!hasZero(stringNumber)) {
            if (doubleMatcher(stringNumber) && isOnlyIncreasing(stringNumber)) {
                ++count;
            }
        }
    }

    return count;
};

console.log('PART 1 Potential codes : ', findCodes(lowerBound, upperBound, hasDouble));
console.log('PART 2 Potential codes : ', findCodes(lowerBound, upperBound, hasExactDouble));