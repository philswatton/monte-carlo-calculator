// Step 1: Limit Character Input
const reLimit = /[0-9\+\-\*\/~\.\(\)\^]|Backspace|ArrowLeft|ArrowRight| /;
function limit() {
    var e = event || window.event;  // get event object
    var key = e.key; //get key

    //console.log(key);
    //console.log(re.test(key))

    if (!reLimit.test(key)) {
        //Prevent default action, which is inserting character
        e.preventDefault();
    }
}



// Step 2: Validate, tokenise, and parse input, show error if invalid

// Validation
// 1) Numbers can be as long as user wants
// TODO: 2) Need to allow arbitrary whitespace
// TODO: 3) Can't have multiple /+*.~ more than once in a row, - twice in a row except at start - this is currently done wrong and allows e.g. -+, */, etc
// 4) Can't start with operators
// TODO: 5) Need to add can't end w/ operators
// TODO: 6) Need to add can't repeat ranges, e.g. 5~6~7
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

    // Split formula into characters, remove all whitespace
    chars=f.replace(/ /g,"").split("");

    // Loop over characters, constructing numbers and operators
    let j = 0; //index for output
    for (let i = 0; i < chars.length; i++) {
        test = isDigit(chars[i]); //check if character is a number
        if (test) {
            if (tokens.length == j) { //if it's a number, create unique and 
                tokens.push(chars[i]);
            } else {
                tokens[j] = tokens[j] + chars[i];
            }
        } else if (/\./.test(chars[i]) | /~/.test(chars[i])) {
            tokens[j] = tokens[j] + chars[i];
        } else if ((i == 0 | /\+|\-|\*|\//.test(chars[i-1])) & chars[i] == "-") {
            tokens[j] = chars[i];
        } else if (chars[i]=="(") {
            tokens.push(chars[i]);
            j = tokens.length;
        } else if (chars[i] == ")") {
            tokens[j+1] = chars[i];
            j+=1;
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

// Functions to establish token type
function isOperator(token) {return(/^(\+|\-|\*{1,2}|\/|\^)$/.test(token));}
function isBracket(token){return(/^(\(|\))$/.test(token));}
function tokenType(token) {
    if (isOperator(token)) return("operator");
    if (isBracket(token)) return("bracket");
    return("number");
}

// Functions for checking precedence and associativity
let operators = ["+", "-", "*", "/", "^"]
let precedence = [0, 0, 1, 1, 2]
let associativity = ["left", "left", "left", "left", "right"]
function opPrecedence(token) {return(precedence[operators.indexOf(token)]);}
function opAssociativity(token) {return(associativity[operators.indexOf(token)]);}

// Shunting yard algorithm - parse infix notation to RPN
function parse(tokens) {

    // Output queue and operator stack
    const outQueue = [];
    const opStack = [];
    let t = "";
    let type = "";

    // Shunting Yard Algo
    for (let i = 0; i < tokens.length; i++) {

        // Prepare token and verify type
        t = tokens[i];
        type = tokenType(t);
        
        if (type == "number") {
            outQueue.push(t); //if number, push to queue
        } else if (type == "operator") {
            while (opStack.length > 0) {
                if (opPrecedence(t) < opPrecedence(opStack[0])) {
                    outQueue.push(opStack.shift());
                } else if (opAssociativity(t) == "left" && (opPrecedence(t) <= opPrecedence(opStack[0]))) {
                    outQueue.push(opStack.shift());
                } else {
                    break;
                }
            }
            opStack.unshift(t); //add operator to stack
        } else {
            if (t == "(") {
                opStack.unshift(t); //add bracket to stack
            } else {
                while(opStack.length > 0) {
                    if (opStack[0] != "(") {
                        outQueue.push(opStack.shift());
                    } else {
                        opStack.shift();
                        break;
                    }
                }
            }
            
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
const N = 10000;//250000;

// Convert ranges to values array
function norm(range) {
    // Output array
    let out = [];

    // Convert range to mean and sd
    let nums = range.split("~");
    nums[0] = Number(nums[0]);
    nums[1] = Number(nums[1]);
    const mean = (nums[0] + nums[1])/2;
    const sd = Math.abs(nums[0] - mean)/2;

    // console.log(nums);
    // console.log(mean);
    // console.log(sd);

    // Loop to simulate values
    for (let i = 0; i < N; i++) {
        out.push(Math.sqrt(-2*Math.log(Math.random())) * Math.cos(2*Math.PI*Math.random())); //box mueller transform
        out[i] = (out[i] * sd) + mean;
    }
    
    // Return
    return(out);
}

// MC Evaluation of RPN
function isRange(token) {
    return(/~/.test(token));
}
function MCeval(RPN) {

    // Prepare arrays for MC evaluation
    const l = RPN.length;
    for (let i = 0; i<l; i++) {
        if (RPN[i] == "^") RPN[i] = "**";
    }
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
                var x = evalStack.pop();
                var y = evalStack.pop();
                evalStack.push(eval(y + RPN[j] + x));
            }
            //console.log(evalStack);
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

    return(out);
}



// Step 4: Present simulation results

// Quantile function: R-8 https://en.wikipedia.org/wiki/Quantile#Estimating_quantiles_from_a_sample
function quantile(x, p) {
    const N = x.length;
    const h = Math.floor((N + (1/3))*p); //removing +1 because 0-indexing
    // console.log(h);

    vec = x.sort((a,b)=>a-b)

    return(vec[h]);
}

// Function to build a range from two quantiles
function makeRange(q1, q2) {

    // Check if the quantiles are equal
    if (q1 == q2) {
        return([`${Math.round(q1*10)/10}`, false]);
    } else {
        return([`${Math.round(q1*10)/10}~${Math.round(q2*10)/10}`, true])
    }
}

// Text output function
function printResult(str) {
    document.getElementById('output').innerHTML = str;
}


// TODO: Histogram function



// Step 5: Page functionality

// Calculator buttons
function press(x) {
    document.forms["calculator"]['formula'].value += x;
}

function del() {
    document.forms["calculator"]['formula'].value = document.forms["calculator"]['formula'].value.slice(0, -1);
}

// Wrapper function
function calculate(f) {
    validf = validate(f); //come back to this
    tokens = tokenise(validf);
    rpn = parse(tokens);
    vector = MCeval(rpn);

    q1 = quantile(vector, 0.025);
    q2 = quantile(vector, 0.975);

    range = makeRange(q1, q2);

    if (range[1]) {
        printResult(range[0]);
    } else {
        printResult("No ranges included: " + range[0]);
    }

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
