// Step 1: Limit Character Input
const reLimit = /[0-9\+\-\*\/~\.]|Backspace|ArrowLeft|ArrowRight/;
function calc_limit() {
    var e = event || window.event;  // get event object
    var key = e.key; //get key

    // console.log(key)
    // console.log(re.test(key))

    if (!reLimit.test(key)) {
        //Prevent default action, which is inserting character
        e.preventDefault();
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
        parse(tokens);
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

    // Return
    return(tokens);

}

// Parse:
// Convert tokens array to RPN (Reverse Polish Notation)
// Use the shunting yard algorithm (simplified by lack of paranetheses)
function isOperator(token) {
    return(/^(\+|\-|\*|\/)$/.test(token));
}
function opPrecedence(op) {
    // console.log(/\*/.test(op));
    if (/\*|\//.test(op)) {
        return(1);
    } else {
        return(0);
    }
}
function parse(tokens) {

    // Queue and Stack
    const outQueue = [];
    const opStack = [];

    // Shunting Yard Algo
    for (let i = 0; i < tokens.length; i++) {
        if (isOperator(tokens[i])) {
            if ((opPrecedence(tokens[i]) <= opPrecedence(opStack[0])) && opStack.length > 0) {
                outQueue.push(opStack.shift());
            }
            opStack.unshift(tokens[i]);
        } else {
            outQueue.push(tokens[i]);
        }
    }
    let l = opStack.length;
    if (l > 0) {
        for (let i = 0; i < l; i++) {
            outQueue.push(opStack.shift());
        }
    }

    // output RPN
    return(outQueue);
}



// Step 3: Run monte carlo simulation
const N = 250000;



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