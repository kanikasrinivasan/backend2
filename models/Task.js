const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    deadline: { type: Date },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
