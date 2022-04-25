/* ====== Require Module Section ====== */
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const app = express();
const mongoose = require('mongoose');
const _ = require('lodash');

/* ======= Mongoose DataBase ======= */
main().catch(err => console.log(err));
async function main() {
    /* OPEN CONNECT */
    mongoose.connect("mongodb://localhost:27017/todolistDB", {
        useNewUrlParser: true
    });

    const itemsSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, "Please type something!😒"]
        }
    })

    const Item = mongoose.model("Item", itemsSchema);

    const item1 = new Item({
        name: "Welcome to your todolist!"
    });

    const item2 = new Item({
        name: "Hit the + button to add a new item."
    });

    const item3 = new Item({
        name: "<-- Hit this to delte an item."
    });

    const defaultItems = [item1, item2, item3];

    const listSchema = {
        name: String,
        items: [itemsSchema]
    };
    const List = mongoose.model("List", listSchema);

    //Get App to use body-parser: (Passes Http request)
    app.use(bodyParser.urlencoded({
        exteneded: true
    }));
    //Get express to serve up files in public folder:
    app.use(express.static("public"));
    //Tells app to use ejs module:
    app.set("view engine", "ejs");

    /* ====== Get Routes ====== */
    app.get("/", function (req, res) {
        // let day = date.getDate();
        Item.find({}, (err, foundItems) => {

            if (foundItems.length === 0) {
                Item.insertMany(defaultItems, function (err, items) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Success!😁");
                        items.forEach(name => console.log(name.name));
                    }
                });
                res.redirect("/");
            } else {
                res.render("list", {
                    listTitle: "Today",
                    newListItems: foundItems
                });
            }
        });

    });
    app.get("/:customListName", (req, res) => {
        const customListName = _.capitalize(req.params.customListName);

        List.findOne({
            name: customListName
        }, (err, foundList) => {
            if (!err) {
                if (!foundList) {
                    //Create New List:
                    console.log("Doesn't exist👀");
                    const list = new List({
                        name: customListName,
                        items: defaultItems
                    });

                    list.save();
                    res.redirect("/" + customListName);

                } else {
                    //Show Existing List:
                    console.log("Exists!👯‍♀️");
                    res.render("list", {
                        listTitle: foundList.name,
                        newListItems: foundList.items
                    });
                }
            }
        });


    });

    /* ====== Post Routes ====== */
    app.post("/", (req, res) => {
        const itemName = req.body.newItem;
        const listName = req.body.list;

        const item = new Item({
            name: itemName
        });

        if (listName === "Today") {
            item.save();
            res.redirect("/");
        } else {
            List.findOne({
                    name: listName
                },
                (err, foundList) => {
                    foundList.items.push(item);
                    foundList.save();
                    res.redirect("/" + listName);
                });
        }
    });

    app.post("/delete", (req, res) => {
        const checkedItemId = req.body.checkbox;
        const listName = req.body.listName;

        //Check if item is being deleted from default list vs custom list: 
        if (listName === "Today") {
            Item.findByIdAndRemove(checkedItemId, (err) => {
                if (!err) {
                    console.log("Successfully deleted check item");
                    res.redirect("/");
                }
            });
        } else {
            List.findOneAndUpdate({
                name: listName
            }, {
                $pull: {
                    items: {
                        _id: checkedItemId
                    }
                }
            }, (err, foundList) => {
                if (!err) {
                    res.redirect("/" + listName);
                }
            })
        }


    });
    app.post("/work", function (req, res) {
        let item = req.body.newItem;

        workItems.push(item);
        res.redirect("/work");
    });

    /* ====== Current Port ====== */
    app.listen(3000, function () {
        console.log("Server started on port 3000");
    });
}