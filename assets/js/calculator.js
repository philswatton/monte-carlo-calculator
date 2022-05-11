// Steps for calculator:

// 1: take text input from user on pressing equals
// 2: validate input
// 3: if valid, establish whether an uncerainty component
// 4: if not, just do a normal calculation
// 5: if so, simulate draws, do the math, get the quantiles

// Step 1: Limit Character Input
const reLimit = /[0-9\+\-\*\/~\.]|Backspace|ArrowLeft|ArrowRight/;
function calc_limit() {
    var e = event || window.event;  // get event object
    var key = e.key; //get key

    // console.log(key)
    // console.log(re.test(key))

    if (!reLimit.test(key)) {
        //Prevent default action, which is inserting character
        if (e.preventDefault) e.preventDefault(); //normal browsers
        e.returnValue = false; //IE
    }
}

// Step 2: Validate, tokenise, and parse input, show error if invalid

// Validation
// 1) Numbers can be as long as user wants
// 2) treat RANGES as numbers
// 3) But can't repeat /-+*.~ more than once in a row
// 4) Can't start with operators
const reValid = /^\+|^\*|^\/|^\-{2,}|\+{2,}|\-{3,}|\*{2,}|\/{2,}|~{2,}|\.{2,}/;
function calc_validate(f) {
    test = reValid.test(f)
    if (test) {
        console.log("Formula error");
    } else {
        const tokens = tokenise(f);
        console.log(tokens)
    }
}

// Tokenise
function isDigit(char) {return(/\d+\.{0,1}\d*/.test(char));}
function tokenise(f) {
    // Output array
    let tokens=[];

    // Temp log
    console.log(f);

    // Split formula into characters
    chars=f.split("");
    console.log(chars);

    // Loop over characters, constructing numbers and operators
    let j = 0; //index for output
    for (let i = 0; i < chars.length; i++) {
        test = isDigit(chars[i])
        if (test) {
            if (tokens.length == j) {
                tokens.push(chars[i]);
            } else {
                tokens[j] = tokens[j] + chars[i];
            }
        } else if (/\./.test(chars[i]) | /~/.test(chars[i])) {
            tokens[j] = tokens[j] + chars[i];
        } else if ((i == 0 | /\+|\-|\*|\//.test(chars[i-1])) & chars[i] == "-") {
            tokens[j] = chars[i];
        // } else if (/\-/.test(chars[i])) {
        //     if (chars[i-1] == "-" & chars[i])
        } else {
            tokens[j+1] = chars[i];
            j+=2;
        }
    }

    return(tokens);

}

// Parse:
// 1) establish constants vs normal distributions
// 2) preserve operator placements
function parse(tokens) {

    // Split input to 

    // Queue and Stack
    const outQueue = [];
    const opStack = [];


}

// Step 3: Run monte carlo simulation

// Step 4: Present simulation results

// Equals button calls functions
document.addEventListener("DOMContentLoaded", function() {
    // console.log('DOM is loaded')
    const equals = document.getElementById("equals");
    equals.addEventListener('click', function() {
        const f = document.getElementById("formula").value;
        calc_validate(f);
    });
});
