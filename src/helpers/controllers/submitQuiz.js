import QuizSubmission from "@/models/quizsubmissionModel";
import Quiz from "@/models/quizModel";


const submitQuiz = async (QuizId, answers, score, userId) => {
  try {
    let existingSubmission = await QuizSubmission.findOne({ QuizId, userId });
    const maxIndex = Math.max(...Object.keys(answers).map(Number));
    const answersArray = Array.from({ length: maxIndex + 1 }, (_, i) => answers[i] || '');
    if (existingSubmission) {
      existingSubmission.answers = answersArray;
      existingSubmission.score = score;
      existingSubmission.submissionTime = new Date();
      await existingSubmission.save();
      return { success: true, message: "Quiz submission updated successfully", submission: existingSubmission };
    } else {
      const newSubmission = new QuizSubmission({
        QuizId,
        userId,
        answersArray,
        score,
      });
      await newSubmission.save();
      return { success: true, message: "Quiz submitted successfully", submission: newSubmission };
    }
  } catch (error) {
    return { success: false, message: "Error submitting quiz", error: error.message };
  }
};

export default submitQuiz;
