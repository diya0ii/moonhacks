import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
  user: { type: String, ref: "User", required: true, index: true }, // ClerkId
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true, index: true },
  club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true, index: true },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending", index: true },
  completionTime: { type: Number }, // Time taken in minutes
  submittedAt: { type: Date, index: true },
  creditsEarned: { type: Number, default: 0, index: true },
  aiCreditCalculation: {
    timeFactor: Number,
    difficultyFactor: Number,
    qualityFactor: Number,
    bonusCredits: Number,
    latePenalty: Number,
    explanation: String
  },
  feedback: { givenBy: { type: String, ref: "User" }, content: String, givenAt: Date },
  semanticProgress: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

export default mongoose.models.Progress || mongoose.model("Progress", ProgressSchema);
