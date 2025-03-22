import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, required: true },
  club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true, index: true },
  createdBy: { type: String, ref: "User", required: true, index: true }, // ClerkId
  startDate: { type: Date, required: true, index: true },
  endDate: { type: Date, required: true, index: true },
  location: { type: String },
  isVirtual: { type: Boolean, default: false },
  meetingLink: { type: String },
  attendees: [{ type: String, ref: "User" }], // ClerkId
  isPublic: { type: Boolean, default: false, index: true },
  isPinnedToHomepage: { type: Boolean, default: false, index: true },
  isApprovedByAdmin: { type: Boolean, default: false, index: true },
  attachments: [{ type: String }],
  tags: [{ type: String, index: true }]
}, { timestamps: true });

EventSchema.index({ title: "text", description: "text", tags: "text" });

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
