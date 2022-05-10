// Steps for calculator:

// 1: take text input from user on pressing equals
// 2: validate input
// 3: if valid, establish whether an uncerainty component
// 4: if not, just do a normal calculation
// 5: if so, simulate draws, do the math, get the quantiles

function myFunction() {
    var e = event || window.event;  // get event object
    var key = e.keyCode || e.which; // get key cross-browser

    if (key < 48 || key > 57) { //if it is not a number ascii code
        //Prevent default action, which is inserting character
        if (e.preventDefault) e.preventDefault(); //normal browsers
        e.returnValue = false; //IE
    }
}

const calc_validate = function() {

}

const calc_parse = function() {

}