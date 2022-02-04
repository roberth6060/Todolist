//jshint esversion:6
/**
 * CREATING REUSABLE MODULES:
 */

//Change JavaScript function to an anonymous function:

//get date 
module.exports.getDate = function () {
    const today = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    // Converts a date to a String, returning the "date" portion using the operating 
    // system's locale's conventions: (pass in var options to format date string)
    return today.toLocaleDateString("en-US", options);
};

//Get day 
exports.getDay = function () {
    const today = new Date();
    const options = {
        weekday: "long"
    };
    // Converts a date to a String, returning the "date" portion using the operating 
    // system's locale's conventions: (pass in var options to format date string)
    return today.toLocaleDateString("en-US", options);
};
