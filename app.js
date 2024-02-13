const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const User = require("./userModel");
const router = require("./authController");
const taskRouter = require("./taskController");

mongoose.connect("mongodb+srv://roott:admin@cluster0.xqbr6os.mongodb.net/?retryWrites=true&w=majority", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
});



const app = express();
const authMiddleware = require("./authMiddleware");

app.use(cookieParser());
app.use(authMiddleware);

app.use(router);
app.use(taskRouter);

//render static pages
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/static/register.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/static/login.html');
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
