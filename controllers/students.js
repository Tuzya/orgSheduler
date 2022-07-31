const Student = require('../models/Student');

exports.allStudents = async (req, res) => {
  try {
    const students = await Student.find({}).sort({ createdAt: -1 }).lean();
    res.status(200).json(students);
  } catch (err) {
    console.log('teachersAndTime get error', err);
    res.status(500).json({ err: err.message });
  }
};

exports.getComment = async (req, res) => {
  const { name, group } = req.query;
  const current = new Date().setHours(0, 0, 0, 0);
  try {
    const student = await Student.findOne(
      { name, group, 'history.date': new Date(current) },
      { history: 1 }
    ).lean();
    if (student) {
      const lastRecord = student.history[student.history.length - 1];
      res.status(200).json({ rating: lastRecord.rating, comment: lastRecord.comment });
    } else {
      res.status(200).json({ rating: null, comment: null });
    }
  } catch (err) {
    console.log('teachersAndTime get error', err);
    res.status(500).json({ err: err.message });
  }
};

exports.updStudent = async (req, res) => {
  const { name, groupName, historyEl } = req.body;

  try {
    let student = await Student.findOne({ name: name, group: groupName });
    if (!student) {
      student = new Student({ name, group: groupName, history: [historyEl] });
    } else {
      let index = student.history.findIndex((history) => history.date.getTime() === historyEl.date);

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
