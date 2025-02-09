const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MockTestSchema = new Schema({
  title: String,
  mocktests:{ type: Schema.Types.ObjectId, ref: "workspaces" },
  questions: [String],
  answers: [String],
});

const MockTest = mongoose.models.mocktests || mongoose.model("mocktests", MockTestSchema);

export default MockTest;
