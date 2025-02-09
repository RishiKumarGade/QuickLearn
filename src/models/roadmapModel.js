const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoadmapSchema = new Schema({
  workspaceId: { type: Schema.Types.ObjectId, ref: "WorkSpace", required: true },
  title: { type: String, required: true },
  learningModule: [
    {
      title: String,
      slides: [String],
      quiz: { type: Schema.Types.ObjectId, ref: "Quiz"},
      isCompleted: {type:Boolean,default: false}
    },
  ],
});

const RoadMap = mongoose.models.roadmaps || mongoose.model('roadmaps',RoadmapSchema);

export default RoadMap;