import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date },
  time: { type: String },
  createdAt: { type: Date, default: Date.now },
});

TaskSchema.index({ dueDate: 1 }); // Supports filtering in reports
TaskSchema.index({ completed: 1 });

export default mongoose.model('Task', TaskSchema);
