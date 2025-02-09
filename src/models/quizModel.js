const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
  questions: [{question:String,choices:[String]}],
  answers: [String],
});

const Quiz = mongoose.models.quizzes || mongoose.model("quizzes", QuizSchema);

export default Quiz;
