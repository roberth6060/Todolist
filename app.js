/**
 * Intsall ejs module (npm i ejs)
 */
//jshint esversion:6
const express = require("express");
//Require body parser:
const bodyParser = require("body-parser");
//Require function in date.js (current directory name + date.js):
const date = require(__dirname + "/date.js");
//Requires express:
const app = express();

const items = [];
const workItems = [];

//Get App to use body-parser: (Passes Http request)
app.use(bodyParser.urlencoded({
    exteneded: true
}));
//Get express to serve up files in public folder:
app.use(express.static("public"));
//Tells app to use ejs module:
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    let day = date.getDate();
    //Express looks into views folder for a file called list with extension ejs:
    res.render("list", {
        listTitle: day,
        newListItems: items
    });
});

// handles post request that come to home root:
app.post("/", function (req, res) {
    let item = req.body.newItem;

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
        console.log(req.body);
    } else {
        items.push(item);
        res.redirect("/");
        console.log(req.body);
    }

});

//Add another root:
app.get("/work", function (req, res) {
    res.render("list", {
        listTitle: "Work List",
        newListItems: items
    });
});
app.post("/work", function (req, res) {
    let item = req.body.newItem;

    workItems.push(item);
    res.redirect("/work");
});

//Create an about page that targets about.ejs:
app.get("/about", function(req, res) {
    //About page takes no parameters:
    res.render("about");
});


app.listen(3000, function () {
    console.log("Server started on port 3000");
});