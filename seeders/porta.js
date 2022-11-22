const mongoose = require('mongoose');
require('dotenv').config();
require('./connection');
const fs = require('fs').promises;
const Student = require('../models/Student');
const Group = require('../models/Group');

const main = async () => {
  const studentsArr = await fs.readFile('students');
  const students = JSON.parse(studentsArr);
  const groups = await Group.find().lean();

  for (let i = 0; i < groups.length; i++) {
    const group = await Group.findOne({name: groups[i].name})
    for (let j = 0; j < groups[i].students.length; j++) {
      stModel = {
        name: groups[i].students[j],
        group: group._id,
        photoUrl: '',
        history: []
      }
      const student = await Student.create(stModel)
      console.log('file-porta.js student:', student);
    }
  }

  for (let i = 0; i < students.length; i++) {
    const stName = students[i].name;

    for (let j = 0; j < students[i].history.length; j++) {
      students[i].history[j].date = new Date();
      delete students[i].history[j]._id
    }
    const res = await Student.updateOne({name: stName}, {history: students[i].history})
    console.log('file-porta.js res:', res);
  }
    mongoose.disconnect();
}

main();


