const mongoose = require('mongoose');
const Student = require('../models/Student');
const Group = require('../models/GroupSchema');

const { Schema, model } = mongoose;

const groupSchema = new Schema({
  name: {type: String, unique: true},
  phase: { type: Number, default: 1 },
  groupType: { type: String, default: 'online' },
  students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
  shedule: Object,
  crshedule: {
    type: Object,
    days: {
      type: Object,
      mon: Boolean,
      tue: Boolean,
      wed: Boolean,
      thu: Boolean,
      fri: Boolean
    }
  },
  crtables: [{ crDay: String, tableData: [{}] }],
  isArchived: { type: Boolean, default: false }
});

groupSchema.pre('updateOne', function (next) {
  // Remove all the docs that refers
  // console.log('query criteria',this.getQuery());// { _id: 5bc8d61f28c8fc16a7ce9338 }
  // console.log('>>>>>>>', this._update.students);// { '$set': { name: 'I was updated!' } }
  // console.log('<<<<<<', this._conditions);
  const modifiedField = this.getUpdate();

  if (modifiedField.isArchived === false)
    Student.updateOne({ _id: { $in: modifiedField.students } }, { isArchived: false }).then(
      (res) => {
        console.log('res', res);
      }
    );
  next();
});

groupSchema.pre('deleteOne', function (next) {
console.log('file-Group.js remove:');
next()
}) //todo удаление

groupSchema.statics.createGroupAndStudents = async function (
  name,
  phase,
  students,
  shedule,
  groupType
) {

  const studentsInDb = await Student.find({name: {$in: students}});
  if (studentsInDb.length !== 0) {
    const err = new Error(`Student(s) ${studentsInDb.map((student) => student.name)} already exist`)
    err.code = 11000;
    err.keyValue = studentsInDb.map((student) => student.name)
    throw err
  }

  const group = new this({
    name,
    phase,
    students: [],
    shedule,
    groupType
  });

  const studentsModels = await Student.create(
    students.map((studentName) => ({
      name: studentName,
      group: group._id,
      groupType: groupType,
      history: []
    }))
  );

  group.students = studentsModels.map((student) => student._id);

  return group.save();
};

groupSchema.statics.updateGroupAndStudents = async function (
  id,
  name,
  phase,
  students,
  shedule,
  groupType
) {

  const group = await this.updateOne(
    { _id: id },
    {
      name,
      phase,
      students,
      shedule,
      groupType
    }
  );
};

module.exports = model('Group', groupSchema);
