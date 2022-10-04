const { Schema, model } = require('mongoose');

const studentsSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    group: { type: Schema.Types.ObjectId, ref: 'Group' },
    groupType: String,
    isArchived: { type: Boolean, default: false },
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

studentsSchema.statics.findActive = function(query) { // ищем студентов у которых isArchive === false
  if (!query) { query = {} }
  query.isArchived = (query.isArchived !== undefined);
  return this.find(query);
}

module.exports = model('Student', studentsSchema);
