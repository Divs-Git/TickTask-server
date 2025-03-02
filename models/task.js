import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    tile: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    priority: {
      type: String,
      default: 'normal',
      enum: ['low', 'medium', 'high', 'normal'],
    },
    stage: {
      type: String,
      default: 'todo',
      enum: ['todo', 'in progress', 'completed'],
    },
    activities: {
      type: {
        type: String,
        default: 'assigned',
        enum: [
          'assigned',
          'in progress',
          'completed',
          'started',
          'commented',
          'bug',
        ],
      },
      activity: String,
      date: {
        type: Date,
        default: Date.now,
      },
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },

    subTasks: [
      {
        title: String,
        date: Date,
        tag: String,
      },
    ],

    assets: [String],
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    isTrashed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);
export default Task;
