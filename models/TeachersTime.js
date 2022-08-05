const { Schema, model } = require('mongoose');

const teachersTimeSchema = new Schema({
  groupType: { type: String, unique: true },
  teachers: [String],
  timegaps: [String]
});

module.exports = model('TeachersTime', teachersTimeSchema);
