import QuizSubmission from "@/models/quizsubmissionModel";

const submitQuiz = async (QuizId, answers, score, userId) => {
  try {
    let existingSubmission = await QuizSubmission.findOne({ QuizId, userId });
    if (existingSubmission) {
      existingSubmission.answers = answers;
      existingSubmission.score = score;
      existingSubmission.submissionTime = new Date();
      await existingSubmission.save();
      return { success: true, message: "Quiz submission updated successfully", submission: existingSubmission };
    } else {
      const newSubmission = new QuizSubmission({
        QuizId,
        userId,
        answers,
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
