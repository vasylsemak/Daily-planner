const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


//   Mongoose connection and model
mongoose.connect("mongodb://localhost:27017/dailyplannerDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MODELS  --------------------------------------------------------------------
//   task Schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

//   task Model
const Task = mongoose.model("Task", taskSchema);

const hi = new Task({
  title: "Welcome to your planner",
});
const graduate = new Task({
  title: "Graduate from Fullstack",
});
const switzerland = new Task({
  title: "Move to Switzerland permanently",
});

const defaultTasks = [hi, graduate, switzerland];


//   list Schema
const listSchema = new mongoose.Schema({
  name: String,
  items: [taskSchema],  //  assosiation One-To_Many
});

//   list Model
const List = mongoose.model("List", listSchema);



//   ROUTES    -------------------------------------------------------------------
//   GET
app.get("/", (req, res) => {
  Task.find((error, foundTasks) => {

    if (foundTasks.length === 0) {
      Task.insertMany(defaultTasks, (error) => {
        if (error) console.log(error);
        else console.log("Successfully saved default tasks");
      });
      res.redirect("/");
    }
    else {
      res.render("index", {
        listTitle: "Work",
        taskItems: foundTasks,
      });
    }
  });
});


app.get("/:userList", (req, res) => {
  const userList = _.capitalize(req.params.userList);

  List.findOne({ name: userList }, (error, foundList) => {
    if (!error) {
      if (!foundList) {
        const list = new List({
          name: userList,
          items: defaultTasks,
        });
        list.save();
        res.redirect("/" + userList);
      }
      else {
        res.render("index", {
          listTitle: foundList.name,
          taskItems: foundList.items,
        });
      }
    }
    else console.log(error);
  });
});


//   POST
app.post("/", (req, res) => {
  const taskTitle = req.body.newItem;
  const listName = req.body.buttonItem;
  const newTask = new Task({ title: taskTitle });

  if (listName === "Work") {
    newTask.save();
    res.redirect("/");
  }
  else {
    List.findOne({ name: listName }, (err, foundList) => {
      if (!err) {
        foundList.items.push(newTask);
        foundList.save();
        res.redirect("/" + listName);
      }
      else console.log("No lis found with tis name", err);
    });
  }
});


//   DELETE
app.post("/delete", (req, res) => {
  const checkedTaskId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Work") {
    Task.deleteOne({ _id: checkedTaskId }, (error) => {
      if (error) console.log(error);
      else {
        console.log("Task has been removed form DB");
        res.redirect("/");
      }
    });
  }
  else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedTaskId } } },
      (err, foundList) => {
        if (!err) {
          console.log("Task has been removed form DB");
          res.redirect("/" + listName);
        }
      }
    );
  }
});


app.listen(3000, () => console.log("Server is running on port 3000."));
