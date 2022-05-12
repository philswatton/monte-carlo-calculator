// Step 1: Limit Character Input
const reLimit = /[0-9\+\-\*\/~\.]|Backspace|ArrowLeft|ArrowRight/;
function limit() {
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
// 2) Need to allow arbitrary whitespace
// 3) Can't have multiple /+*.~ more than once in a row, - twice in a row except at start - this is currently done wrong and allows e.g. -+, */, etc
// 4) Can't start with operators
// 5) Need to add can't end w/ operators
// 6) Need to add can't repeat ranges, e.g. 5~6~7
const reValid = /^\+|^\*|^\/|^\-{2,}|\+{2,}|\-{3,}|\*{2,}|\/{2,}|~{2,}|\.{2,}/;
function validate(f) {
    test = reValid.test(f)
    if (test) {
        console.log("Formula error");
    } else {
        return(f);
    }
}

// Tokenise
function isDigit(char) {return(/\d+\.{0,1}\d*/.test(char));}
function tokenise(f) {
    // Output array
    let tokens=[];

    // Split formula into characters
    chars=f.split("");

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

    // Simplified Shunting Yard Algo
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

// number of simulations - in future possibly allow user to specify
const N = 50;//250000;

// Convert ranges to values array
function norm(range) {
    // Output array
    let out = [];

    // Convert range to mean and sd
    let nums = range.split("~");
    nums[0] = Number(nums[0]);
    nums[1] = Number(nums[1]);
    const mean = (nums[0] + nums[1])/2;
    const sd = Math.abs(nums[0] - mean);

    // console.log(nums);
    // console.log(mean);
    // console.log(sd);

    // Loop to simulate values
    for (let i = 0; i < N; i++) {
        out.push(Math.sqrt(-2*Math.log(Math.random())) * Math.cos(2*Math.PI*Math.random())); //box mueller transform
        out[i] = (out[i] * sd) + mean;
    }

    return(out);
}

// MC Evaluation of RPN
function isRange(token) {
    return(/~/.test(token));
}
function MCeval(RPN) {

    // Prepare arrays for MC evaluation
    const l = RPN.length;
    const rIndex = [];
    let rArrays = [];
    let test = false;
    for (let i=0; i<l; i++) {
        test = isRange(RPN[i]);
        rIndex.push(test);
        if (test) {
            rArrays.push(norm(RPN[i]));
        }
    }

    
    // Loop over simulation iterations
    let evalStack = [];
    let rCount = 0;
    const out = [];
    for (let i=0; i<N; i++) {
        evalStack = []; //refresh eval stack
        rCount = 0; //refresh range count
        for (let j=0; j<l; j++) {
            if (!isOperator(RPN[j])) {
                if (isRange(RPN[j])) {
                    evalStack.push(rArrays[rCount][i]);
                    rCount++;
                } else {
                    evalStack.push(RPN[j]);
                }
            } else {
                evalStack.push(eval(evalStack.pop() + RPN[j] + evalStack.pop()));
            }
        }
        out.push(evalStack[0]);
    }

    // for (let i=0; i<RPN.length; i++) {
    //     if (!isOperator(RPN[i])) {
    //         evalStack.push(RPN[i])
    //     } else {
    //         evalStack.push(eval(evalStack.pop() + RPN[i] + evalStack.pop()));
    //     }
    // }

    // console.log(evalStack[0]);
    // console.log(RPN);
    // console.log(rIndex);
    return(out);
}



// Step 4: Present simulation results



// Step 5: Page functionality

// Wrapper function
function calculate(f) {
    validf = validate(f);
    tokens = tokenise(validf);
    rpn = parse(tokens);
    MCeval(rpn);

    // console.log(rpn);
}

// Equals button event listener
document.addEventListener("DOMContentLoaded", function() {
    // console.log('DOM is loaded')
    const equals = document.getElementById("equals");
    equals.addEventListener('click', function() {
        const f = document.getElementById("formula").value;
        calculate(f);
    });
});
