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

// Step 2: Validate and parse input, show error if invalid

// Validation
// 1) Numbers can be as long as user wants
// 2) treat RANGES as numbers
// 3) But can't repeat /-+*.~ more than once in a row

// Parse:
// 1) establish constants vs normal distributions
// 2) preserve operator placements

// Some temporary examples to work with
const f1 = "2+2~5-3";
const f2 = "25.6*2~4/3";
const f3 = "30*4~10.5+10+10~20";
// const f4 = "20++30";
// const f5 = "20~~~30";

const reValid = /^\-{2,}|\+{2,}|\-{3,}|\*{2,}|\/{2,}|~{2,}|\.{2,}/;
function calc_validate(f) {
    test = reValid.test(f)
    if (test) {
        console.log("Formula error");
    } else {
        tokenise(f);
    }
}

function isDigit(char) {return(/\d+\.{0,1}\d*/.test(char));}

function tokenise(f) {
    // Output array
    let out=[];

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
            if (out.length == j) {
                out.push(chars[i]);
            } else {
                out[j] = out[j] + chars[i];
            }
        } else if (/\./.test(chars[i]) | /~/.test(chars[i])) {
            out[j] = out[j] + chars[i];
        } else if ((i == 0 | /\+|\-|\*|\//.test(chars[i-1])) & chars[i] == "-") {
            out[j] = chars[i];
        // } else if (/\-/.test(chars[i])) {
        //     if (chars[i-1] == "-" & chars[i])
        } else {
            out[j+1] = chars[i];
            j+=2;
        }
    }

    console.log(out);

}

function parse(f) {

    // Split input to 

    // Queue and Stack
    const outQueue = [];
    const opStack = [];


}

// function calc_parse(f) {



//     // const outQueue=[];
//     // const opStack=[];
//     const step1 = f.split("-");
//     //const step2 = step1.split("+");

//     console.log(step1);
//     console.log(step2);
// }

// calc_validate(f1);
// calc_validate(f2);
// calc_validate(f3);
// calc_validate(f4);
// calc_validate(f5);

// calc_parse(f1);

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
