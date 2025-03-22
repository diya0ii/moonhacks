import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // ClerkId as _id
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Lead", "Member"], required: true, default: "Member", index: true },
  clubs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Club", index: true }],
  totalCredits: { type: Number, default: 0 },
  profileImage: { type: String },
  joinedAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
}, { timestamps: true, _id: false });

UserSchema.index({ name: "text", email: "text" });

export default mongoose.models.User || mongoose.model("User", UserSchema);
