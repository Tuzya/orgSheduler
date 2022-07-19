const { Schema, model } = require('mongoose');

const CodeReviewDataSchema = new Schema({
  teachers: [String],
  timegaps: [String],
  history: [{crDay: String, tableData: []}],
});

module.exports = model('CodeReviewData', CodeReviewDataSchema);
