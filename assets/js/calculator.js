// Steps for calculator:

// 1: take text input from user on pressing equals
// 2: validate input
// 3: if valid, establish whether an uncerainty component
// 4: if not, just do a normal calculation
// 5: if so, simulate draws, do the math, get the quantiles

// Step 1: Limit Character Input
const re = /[0-9\+\-\*\/~]|Backspace/;
function calc_validate() {
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

// Wrap next steps in event listener tied to = button

const calc_parse = function() {

}