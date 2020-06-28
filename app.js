const express = require("express");
const mongoose = require("mongoose");
const app = express();
// const date = require(__dirname + "/date.js");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


//   Mongoose connection and model
mongoose.connect("mongodb://localhost:27017/dailyplannerDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

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


//   Routes
app.get("/", (req, res, next) => {
  Task.find((error, foundTasks) => {

    if (foundTasks.length === 0) {
      Task.insertMany(defaultTasks, (error) => {
        if (error) console.log(error);
        else console.log("Successfully saved default tasks");
      });
      res.redirect("/");
    } else {
      res.render("index", { listTitle: "Today", newListItems: foundTasks });
    }
  });
});


app.post("/", (req, res, next) => {
  const taskTitle = req.body.newItem;
  const newTask = new Task({ title: taskTitle });
  newTask.save();
  res.redirect("/");
});


app.post("/delete", (req, res, next) => {
  const checkedTaskId = req.body.checkbox;

  Task.deleteOne({ _id: checkedTaskId }, (error) => {
    if (error) console.log(error);
    else {
      console.log("Task has been removed form DB");
      res.redirect("/");
    }
  });
});


app.listen(3000, () => console.log("Server is running on port 3000."));
