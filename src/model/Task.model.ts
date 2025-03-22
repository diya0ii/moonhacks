import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, required: true },
  club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true, index: true },
  assignedBy: { type: String, ref: "User", required: true, index: true }, // ClerkId
  assignedTo: { type: String, ref: "User", required: true, index: true }, // ClerkId
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending", index: true },
  priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium", index: true },
  difficulty: { type: Number, default: 5, index: true },
  dueDate: { type: Date, index: true },
  isOverdue: { type: Boolean, default: false, index: true },
  submissionDetails: { submittedAt: Date, description: String, attachments: [String] },
  credits: { type: Number, default: 0 }, // Groq AI-generated credits
  semanticTags: [{ type: String }],
  aiMetadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

// Prevent self-assignment of tasks
TaskSchema.pre("save", function (next) {
  if (this.assignedBy === this.assignedTo) {
    return next(new Error("Self-task assignment is not allowed"));
  }
  next();
});

TaskSchema.index({ title: "text", description: "text", semanticTags: "text" });

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
