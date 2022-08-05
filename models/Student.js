const { Schema, model } = require('mongoose');

const StudentsSchema = new Schema(
  {
    name: String,
    group: String,
    history: [
      {
        phase: Number,
        groupType: String,
        date: Date,
        teacher: String,
        rating: String,
        comment: String
      }
    ]
  },
  {
    timestamps: true
  }
);
module.exports = model('Student', StudentsSchema);
