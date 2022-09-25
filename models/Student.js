const { Schema, model } = require('mongoose');

const StudentsSchema = new Schema(
  {
    name: String,
    group: { type: Schema.Types.ObjectId, ref: 'Group' },
    isArchived: {type: Boolean, default: false},
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
