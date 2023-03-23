const { Schema, model } = require('mongoose');

const studentsSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    group: { type: Schema.Types.ObjectId, ref: 'Group' },
    photoUrl: { type: String, default: '' },
    history: [
      {
        phase: Number,
        groupType: String,
        groupName: { type: String, default: '' },
        date: Date,
        teacher: String,
        rating: String,
        comment: String,
        quality: {
          type: String,
          enum: ['normal', 'problem'],
          default: 'normal'
        }
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
    query.groupType === undefined || query.groupType === ''
      ? { $regex: /\b(?!inactive\b)\w+/, $options: 'i' } // ищем студентов у которых groupType не inactive
      : query.groupType;
  return this.find(query);
};

studentsSchema.statics.createStudents = async function (studentsNamesArr, groupId) {
  const uniqStudents = [...new Set(studentsNamesArr)];
  const studentsInDb = await this.find({ name: { $in: uniqStudents } });
  if (studentsInDb.length !== 0) {
    const err = new Error(
      `Student(s) ${studentsInDb.map((student) => student.name)} already exist`
    );
    err.code = 11000;
    err.keyValue = studentsInDb.map((student) => student.name);
    throw err;
  }
  return await this.create(
    uniqStudents.map((studentName) => ({
      name: studentName,
      group: groupId,
      history: []
    }))
  );
};

module.exports = model('Student', studentsSchema);
