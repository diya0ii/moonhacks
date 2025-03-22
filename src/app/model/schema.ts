// models/index.js
import mongoose, { Schema, Document } from 'mongoose';

// Define interfaces for type safety
interface IUser extends Document {
  _id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Lead' | 'Member';
  clubs: mongoose.Types.ObjectId[];
  totalCredits: number;
  profileImage?: string;
  joinedAt: Date;
  lastActive: Date;
}

interface IClub extends Document {
  name: string;
  description?: string;
  lead: string;
  members: string[];
  createdBy: string;
  coverImage?: string;
  tags: string[];
  isActive: boolean;
}

interface ITask extends Document {
  title: string;
  description: string;
  club: mongoose.Types.ObjectId;
  assignedBy: string;
  assignedTo: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  difficulty: number;
  dueDate?: Date;
  isOverdue: boolean;
  submissionDetails?: {
    submittedAt: Date;
    description: string;
    attachments: string[];
  };
  credits: number;
  semanticTags: string[];
  aiMetadata: any;
}

interface IClubEvent extends Document {
  title: string;
  description: string;
  club: mongoose.Types.ObjectId;
  createdBy: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  isVirtual: boolean;
  meetingLink?: string;
  attendees: string[];
  isPublic: boolean;
  isPinnedToHomepage: boolean;
  isApprovedByAdmin: boolean;
  attachments: string[];
  tags: string[];
}

interface IProgress extends Document {
  user: string;
  task: mongoose.Types.ObjectId;
  club: mongoose.Types.ObjectId;
  status: 'Pending' | 'In Progress' | 'Completed';
  completionTime?: number;
  submittedAt?: Date;
  creditsEarned: number;
  aiCreditCalculation?: {
    timeFactor: number;
    difficultyFactor: number;
    qualityFactor: number;
    bonusCredits: number;
    latePenalty: number;
    explanation: string;
  };
  feedback?: {
    givenBy: string;
    content: string;
    givenAt: Date;
  };
  semanticProgress: any;
}

// Users Collection Schema
const UserSchema = new Schema({
  _id: {
    type: String, // Using clerkId directly as _id
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Lead', 'Member'],
    required: true,
    default: 'Member',
    index: true
  },
  clubs: [{
    type: Schema.Types.ObjectId,
    ref: 'Club',
    index: true
  }],
  totalCredits: {
    type: Number,
    default: 0
  },
  profileImage: {
    type: String
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true, _id: false }); // _id: false to use custom _id

// Clubs Collection Schema
const ClubSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Added unique constraint
    index: true
  },
  description: {
    type: String
  },
  lead: {
    type: String, // Using clerkId as reference
    ref: 'User',
    index: true
  },
  members: [{
    type: String, // Using clerkId as reference
    ref: 'User'
  }],
  createdBy: {
    type: String, // Using clerkId as reference
    ref: 'User',
    required: true
  },
  coverImage: {
    type: String
  },
  tags: [{
    type: String,
    index: true
  }],
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, { timestamps: true });

// Tasks Collection Schema
const TaskSchema = new Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  club: {
    type: Schema.Types.ObjectId,
    ref: 'Club',
    required: true,
    index: true
  },
  assignedBy: {
    type: String, // Using clerkId as reference
    ref: 'User',
    required: true,
    index: true
  },
  assignedTo: {
    type: String, // Using clerkId as reference
    ref: 'User',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
    index: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium',
    index: true
  },
  difficulty: {
    type: Number,  // 1-10 scale
    default: 5,
    index: true
  },
  dueDate: {
    type: Date,
    index: true
  },
  isOverdue: { // Added isOverdue field
    type: Boolean, 
    default: false, 
    index: true 
  },
  submissionDetails: {
    submittedAt: Date,
    description: String,
    attachments: [String] // URLs to attachments, validation to be implemented in backend
  },
  credits: {
    type: Number,
    default: 0  // Will be calculated by Groq AI
  },
  // Groq AI semantic indexing fields
  semanticTags: [{
    type: String
  }],
  aiMetadata: {
    type: Schema.Types.Mixed  // Flexible field for AI analysis
  }
}, { timestamps: true });

// Events Collection Schema
const EventSchema = new Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  club: {
    type: Schema.Types.ObjectId,
    ref: 'Club',
    required: true,
    index: true
  },
  createdBy: {
    type: String, // Using clerkId as reference
    ref: 'User',
    required: true,
    index: true
  },
  startDate: {
    type: Date,
    required: true,
    index: true
  },
  endDate: {
    type: Date,
    required: true,
    index: true
  },
  location: {
    type: String
  },
  isVirtual: {
    type: Boolean,
    default: false
  },
  meetingLink: {
    type: String
  },
  attendees: [{
    type: String, // Using clerkId as reference
    ref: 'User'
  }],
  isPublic: {
    type: Boolean,
    default: false,
    index: true
  },
  isPinnedToHomepage: {
    type: Boolean,
    default: false,
    index: true
  },
  isApprovedByAdmin: { // Added admin approval for homepage pinning
    type: Boolean, 
    default: false, 
    index: true 
  },
  attachments: [{
    type: String  // URLs to attachments, validation to be implemented in backend
  }],
  tags: [{
    type: String,
    index: true
  }]
}, { timestamps: true });

// Progress Tracking Collection Schema
const ProgressSchema = new Schema({
  user: {
    type: String, // Using clerkId as reference
    ref: 'User',
    required: true,
    index: true
  },
  task: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
    index: true
  },
  club: {
    type: Schema.Types.ObjectId,
    ref: 'Club',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
    index: true
  },
  completionTime: {
    // Time taken to complete the task in minutes
    type: Number
  },
  submittedAt: {
    type: Date,
    index: true
  },
  creditsEarned: {
    type: Number,
    default: 0,
    index: true
  },
  // Groq AI credit allocation fields
  aiCreditCalculation: {
    timeFactor: Number,
    difficultyFactor: Number,
    qualityFactor: Number,
    bonusCredits: Number,
    latePenalty: Number, // Added late penalty field
    explanation: String  // AI explains credit allocation
  },
  feedback: {
    givenBy: {
      type: String, // Using clerkId as reference
      ref: 'User'
    },
    content: String,
    givenAt: Date
  },
  // For semantic indexing by Groq
  semanticProgress: {
    type: Schema.Types.Mixed  // Flexible field for AI analysis
  }
}, { timestamps: true });

// Create text indexes for search functionality
UserSchema.index({ name: 'text', email: 'text' });
ClubSchema.index({ name: 'text', description: 'text', tags: 'text' });
TaskSchema.index({ title: 'text', description: 'text', semanticTags: 'text' });
EventSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Task Schema validation for preventing self-assignment
TaskSchema.pre('save', function(this: ITask, next: mongoose.CallbackWithoutResultAndOptionalError) {
  if (this.assignedBy === this.assignedTo) {
    // Implement validation logic in the backend
    // This is just a placeholder - actual validation should be in the route handlers
    // return next(new Error('Self-task assignment is not allowed'));
  }
  next();
});

// Register models
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
const Club = mongoose.models.Club || mongoose.model<IClub>('Club', ClubSchema);
const Task = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
const ClubEvent = mongoose.models.ClubEvent || mongoose.model<IClubEvent>('ClubEvent', EventSchema);
const Progress = mongoose.models.Progress || mongoose.model<IProgress>('Progress', ProgressSchema);

// Utility function for tasks overdue check (to be used with a cron job)
const checkOverdueTasks = async (): Promise<void> => {
  const now = new Date();
  await Task.updateMany(
    { 
      dueDate: { $lt: now }, 
      status: { $ne: 'Completed' },
      isOverdue: false
    },
    { 
      $set: { isOverdue: true } 
    }
  );
};

export {
  User,
  Club,
  Task,
  ClubEvent,
  Progress,
  checkOverdueTasks
};