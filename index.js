
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require("mongoose");

const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use(express.json());

app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));

//connection to db
mongoose.set("useFindAndModify", false); // to avoid an error that we will have further

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
   console.log("Connected to db!");
   app.listen(3000, () => console.log("Server Up and running"));
});// here oue server will only run, after the connection is made!!!!


app.set("view engine", "ejs");


// GET METHOD
app.get("/", (req, res) => {
   TodoTask.find({}, (err, tasks) => {
      res.render("todo.ejs", { todoTasks: tasks });
   });
});

//POST METHOD
app.post('/',async (req, res) => {
   const todoTask = new TodoTask({
      todo: req.body.todo
   });
   try {
      await todoTask.save();
      res.redirect("/");
   } catch (err) {
      res.redirect("/");
   }
});

//UPDATE
//app.route is used for the chain of request and response object.
app.route("/edit/:id")
    .get((req, res) => {
       const id = req.params.id;
       TodoTask.find({}, (err, tasks) => {
          res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
       });
    })
    .post((req, res) => {
       const id = req.params.id;
       TodoTask.findByIdAndUpdate(id, { todo: req.body.todo }, err => {
          if (err) return res.send(500, err);
          res.redirect("/");
       });
    });

//DELETE
app.route("/remove/:id").get((req, res) => {
   const id = req.params.id;
   TodoTask.findByIdAndRemove(id, err => {
      if (err) return res.send(500, err);
      res.redirect("/");
   });
});