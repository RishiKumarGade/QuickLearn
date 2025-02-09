// TODO
import QuizSubmission from "@/models/QuizSubmission";
import MockTestSubmission from "@/models/MockTestSubmission";
import RoadMap from "@/models/Roadmap";
import WorkSpace from "@/models/WorkSpace";
import User from "@/models/User";

// Submit Quiz with Previous Check
export const submitQuiz = async (workspaceId, userId, answers) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // 1. Get workspace and roadmap
    const workspace = await WorkSpace.findById(workspaceId).session(session);
    const roadmap = await RoadMap.findOne({ workspaceId }).session(session);

    if (!roadmap || !workspace) {
      throw new Error("Workspace or Roadmap not found");
    }

    // 2. Find current quiz index
    const submittedQuizzes = await QuizSubmission.find({
      userId,
      quizId: { $in: roadmap.learningModule.map(m => m.quizzes) }
    }).session(session);

    const currentQuizIndex = submittedQuizzes.length;

    // 3. Check previous quiz completion
    if (currentQuizIndex > 0) {
      const previousSubmission = submittedQuizzes[currentQuizIndex - 1];
      if (previousSubmission.marks < 75) {
        throw new Error("Complete previous quiz with 75%+ score first");
      }
    }

    // 4. Get current quiz
    const currentQuiz = await Quiz.findById(
      roadmap.learningModule[currentQuizIndex].quizzes
    ).session(session);

    // 5. Calculate score
    const correctAnswers = currentQuiz.answers.filter(
      (ans, index) => ans === answers[index]
    ).length;
    const score = (correctAnswers / currentQuiz.answers.length) * 100;

    // 6. Save submission
    const submission = new QuizSubmission({
      quizId: currentQuiz._id,
      userId,
      answers,
      marks: score
    });
    await submission.save({ session });

    // 7. Update workspace if last quiz
    if (currentQuizIndex === roadmap.learningModule.length - 1 && score >= 75) {
      workspace.isCompleted = true;
      await workspace.save({ session });
    }

    await session.commitTransaction();
    return { success: true, score };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// Submit Mock Test with Quiz Completion Check
export const submitMockTest = async (mockTestId, userId, answers) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Get mock test and associated workspace
    const mockTest = await MockTest.findById(mockTestId).session(session);
    const workspace = await WorkSpace.findById(mockTest.mocktests).session(session);

    if (!workspace || workspace.type !== "SKILL") {
      throw new Error("Invalid workspace type for mock tests");
    }

    // 2. Check all quizzes completed with 75%+
    const roadmap = await RoadMap.findOne({ workspaceId: workspace._id }).session(session);
    const quizSubmissions = await QuizSubmission.find({
      userId,
      quizId: { $in: roadmap.learningModule.map(m => m.quizzes) }
    }).session(session);

    if (quizSubmissions.length !== roadmap.learningModule.length) {
      throw new Error("Complete all quizzes first");
    }

    if (quizSubmissions.some(sub => sub.marks < 75)) {
      throw new Error("All quizzes must have 75%+ score");
    }

    // 3. Calculate mock test score
    const correctAnswers = mockTest.answers.filter(
      (ans, index) => ans === answers[index]
    ).length;
    const score = (correctAnswers / mockTest.answers.length) * 100;

    // 4. Save mock test submission
    const submission = new MockTestSubmission({
      mockTestId,
      userId,
      answers,
      marks: score
    });
    await submission.save({ session });

    // 5. Update user skill tag if passed
    if (score >= 75) {
      const user = await User.findById(userId).session(session);
      const [skill, level] = workspace.skillTag.split(',');
      
      const existingSkill = user.skillTags.find(t => t.startsWith(skill));
      if (existingSkill) {
        const existingLevel = parseInt(existingSkill.split(',')[1]);
        if (level > existingLevel) {
          user.skillTags = user.skillTags.map(t => 
            t.startsWith(skill) ? `${skill},${level}` : t
          );
        }
      } else {
        user.skillTags.push(workspace.skillTag);
      }
      
      await user.save({ session });
    }

    await session.commitTransaction();
    return { success: true, score };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};