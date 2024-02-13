const express = require("express");
const bodyParser = require("body-parser");
const User = require("./userModel");
const Task = require("./taskModel");
const jwt = require("jsonwebtoken");

const taskRouter = express.Router();

function decodeToken(token){
    //retun user id
    return jwt.verify(token, 'secret').id;
}

taskRouter.use(bodyParser.json());

taskRouter.post("/tasks", async (req, res) => {
    try {
        const { name, dueDate } = req.body;
        const newTask = new Task({
            owner: req.user.id,
            name,
            dueDate
        });
        const savedTask = await newTask.save();
        if (!savedTask) {
            return res.status(500).json({ message: "Task creation failed" });
        }
        res.status(201).json(savedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

taskRouter.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user.id });
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

taskRouter.patch("/tasks/:id", async (req, res) => {
    try {
        const taskId = req.params.id;
        const { name, dueDate, completed } = req.body;
        const task = await Task.findOne({ _id: taskId, owner: req.user.id });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        task.name = name;
        task.dueDate = dueDate;
        task.completed = completed;
        const savedTask = await task.save();
        if (!savedTask) {
            return res.status(500).json({ message: "Task update failed" });
        }
        res.status(200).json(savedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

taskRouter.delete("/tasks/:id", async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findOne({ _id: taskId, owner: userId });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        const deletedTask = await Task.deleteOne({ _id: taskId });
        if (!deletedTask) {
            return res.status(500).json({ message: "Task deletion failed" });
        }
        res.status(200).json(deletedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = taskRouter;

