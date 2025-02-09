const mongoose = require("mongoose");

const QuizSubmissionSchema = new mongoose.Schema({
  QuizId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "quizzes", 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  answers: [
    String
  ],
  submissionTime: { type: Date, default: Date.now },
  score: { type: Number, default: -1 }
});

// MockTestSubmissionSchema.index({ mockTestId: 1, userId: 1 }, { unique: true });

const QuizSubmission = mongoose.model("quizsubmissions", QuizSubmissionSchema);

module.exports = QuizSubmission;
