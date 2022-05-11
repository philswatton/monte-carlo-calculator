// Steps for calculator:

// 1: take text input from user on pressing equals
// 2: validate input
// 3: if valid, establish whether an uncerainty component
// 4: if not, just do a normal calculation
// 5: if so, simulate draws, do the math, get the quantiles

// Step 1: Limit Character Input
const re = /[0-9\+\-\*\/~]|Backspace/;
function calc_limit() {
    var e = event || window.event;  // get event object
    var key = e.key; //get key

    // console.log(key)
    // console.log(re.test(key))

    if (!re.test(key)) {
        //Prevent default action, which is inserting character
        if (e.preventDefault) e.preventDefault(); //normal browsers
        e.returnValue = false; //IE
    }
}

// Step 2: Validate and parse input, show error if invalid
// Numbers can be as long as user wants
// But can't repeat /-+*.~ more than once in a row
function calc_validate(f) {
    console.log(f);
}

// Step 3: Run monte carlo simulation

// Step 4: Present simulation results

// equals button calls functions
document.addEventListener("DOMContentLoaded", function() {
    // console.log('DOM is loaded')
    const equals = document.getElementById("equals");
    equals.addEventListener('click', function() {
        const f = document.getElementById("formula").value;
        calc_validate(f);
    });
});
