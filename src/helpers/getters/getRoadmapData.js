import Roadmap from '@/models/roadmapModel.js';

const getRoadMapData = async (workspaceId) => {
  const ws = await Roadmap.findOne({ workspaceId })
    .populate({
      path: 'learningModule.quiz', 
      model: 'quizzes' 
    });

  return ws;
};

export default getRoadMapData;
