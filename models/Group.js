const mongoose = require('mongoose');
const Student = require('../models/Student');

const { Schema, model } = mongoose;

const groupSchema = new Schema({
  name: { type: String, unique: true },
  phase: { type: Number, default: 1 },
  groupType: { type: String, default: 'inactive' },
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

groupSchema.statics.createGroupAndStudents = async function (
  name,
  phase,
  students,
  shedule,
  groupType
) {
  const uniqStudents = [...new Set(students)];
  const studentsInDb = await Student.find({ name: { $in: uniqStudents } });
  if (studentsInDb.length !== 0) {
    const err = new Error(
      `Student(s) ${studentsInDb.map((student) => student.name)} already exist`
    );
    err.code = 11000;
    err.keyValue = studentsInDb.map((student) => student.name);
    throw err;
  }

  const group = (
    await this.create({
      name,
      phase,
      shedule,
      groupType
    })
  ).toObject({ getters: true });

  const studentsModels = await Student.create(
    uniqStudents.map((studentName) => ({
      name: studentName,
      group: group._id,
      groupType: groupType,
      history: []
    }))
  );
  group.students = studentsModels.map((student) => ({ _id: student.id, name: student.name }));
  return group;
};

groupSchema.statics.updateGroupAndStudents = async function (
  id,
  name,
  phase,
  students,
  deletedStudents,
  shedule,
  groupType
) {
  //find current students in other group
  let inactiveGr = await this.findOne({ name: 'Inactive' }, { _id: 1, groupType: 1 }).lean();
  if (!inactiveGr)
    inactiveGr = this.create({ name: 'Inactive', isArchived: true, groupType: 'inactive' });

  await Student.updateMany({ _id: { $in: students } }, { group: id, groupType: groupType });

  await Student.updateMany({ _id: { $in: deletedStudents } }, [
    {
      $set: {
        name: { $concat: ['$name', '_', new Date().valueOf().toString(36)] },
        group: inactiveGr._id,
        groupType: inactiveGr.groupType
      }
    }
  ]);

  const group = await this.updateOne(
    { _id: id },
    {
      name,
      phase,
      shedule,
      groupType
    }
  );
};

groupSchema.statics.deleteGroupAndStudents = async function (id) {
  const populateOpt = {
    path: 'students',
    model: 'Student',
    select: { _id: 1 }
  };
  const group = await this.findById(id);
  const students = await Student.find({ group: group.id }, { _id: 1 });
  let inactiveGroup = await this.findOne({ name: 'Inactive' });
  const studentsIds = students.map((student) => student._id);
  if (!inactiveGroup)
    inactiveGroup = new this({ name: 'Inactive', isArchived: true, groupType: 'inactive' });
  //перемещаем студентов в гр. inactive
  const updatedStudents = await Student.updateMany({ _id: { $in: studentsIds } }, [
    {
      $set: {
        name: { $concat: ['$name', '_', new Date().valueOf().toString(36)] },
        group: inactiveGroup._id,
        groupType: 'inactive'
      }
    }
  ]);
  inactiveGroup.students = studentsIds;
  await inactiveGroup.save();
  return this.findByIdAndDelete(id);
};

module.exports = model('Group', groupSchema);
