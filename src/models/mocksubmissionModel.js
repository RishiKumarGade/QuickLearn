const mongoose = require("mongoose");

const MockTestSubmissionSchema = new mongoose.Schema({
  mockTestId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "MockTest", 
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
  marks: { type: Number, default: -1 }
});

// MockTestSubmissionSchema.index({ mockTestId: 1, userId: 1 }, { unique: true });

const MockTestSubmission = mongoose.model("mocktestsubmissiontests", MockTestSubmissionSchema);

module.exports = MockTestSubmission;
