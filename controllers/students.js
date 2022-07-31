const Student = require('../models/Student');

exports.allStudents = async (req, res) => {
  try {
    const students = await Student.find({}).sort({updatedAt: -1}).lean();
    res.status(200).json(students);
  } catch (err) {
    console.log('teachersAndTime get error', err);
    res.status(500).json({ err: err.message });
  }
};

exports.getComment = async (req, res) => {
  const id = req.params.id;
  try {
    const comment = await Student.findOne({_id: id}).sort({updatedAt: -1}).lean(); // нужно найта в массиве коментов
    res.status(200).json(comment);
  } catch (err) {
    console.log('teachersAndTime get error', err);
    res.status(500).json({ err: err.message });
  }
};

exports.updStudent = async (req, res) => {
  const { name, groupName, historyEl } = req.body;
  console.log('file-students.js historyEl:', historyEl);
  try {
    let student = await Student.findOne({ name: name, group: groupName });
    if (!student) {
      student = new Student({ name, group: groupName, history: [historyEl] });

    } else {
      let index = student.history.findIndex((history) => history.date.getTime() === historyEl.date);
      console.log('file-students.js index:', index);
      if (index === -1) student.history.push(historyEl);
      else student.history[index] = historyEl;
    }
    await student.save();
    res.status(200).json({ message: 'ok' });
  } catch (err) {
    console.log('teachersAndTime update error', err);
    res.status(500).json({ err: err.message });
  }
};

// name: String,
//   group: String,
//   history: [{type: Object, phase: Number, groupType: String, date: Date, teacher: String, comment: String}]
