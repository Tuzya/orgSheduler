const { Schema, model } = require('mongoose');

const studentsSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    group: { type: Schema.Types.ObjectId, ref: 'Group' },
    // groupType: String,
    photoUrl: {type: String, default: ''},
    history: [
      {
        phase: Number,
        groupType: String,
        groupName: { type: String, default: '' },
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

// studentsSchema.index({ name: 1, group: 1}, { unique: true });

// StudentsSchema.pre('save', async function(next) {
//   console.log('file-Student.js this:', this);
//   console.log('file-Student.js:', await this.populate('group'));
//   // next();
// });

studentsSchema.statics.findActive = function (query) {
  if (!query) {
    query = {};
  }
  query.groupType =
    (query.groupType === undefined || query.groupType === '')
      ? { $regex: /\b(?!inactive\b)\w+/, $options: 'i' } // ищем студентов у которых groupType не inactive
      : query.groupType;
  return this.find(query);
};

module.exports = model('Student', studentsSchema);
