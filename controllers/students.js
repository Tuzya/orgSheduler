const Student = require('../models/Student');

exports.allStudents = async (req, res) => {
  const { name = '', groupType = '', groupId = '' } = JSON.parse(req.query.search);
  const query = groupId
    ? {
        name: { $regex: name, $options: 'i' },
        group: groupId,
        groupType: { $regex: groupType, $options: 'i' }
      }
    : {
        name: { $regex: name, $options: 'i' },
        groupType: { $regex: groupType, $options: 'i' }
      };

  const populateOpt = {
    path: 'group',
    model: 'Group',
    select: { _id: 1, name: 1, groupType: 1 }
  };
  try {
    const students = await Student.find(query).populate(populateOpt).sort({ createdAt: -1 }).lean();
    res.status(200).json(students);
  } catch (err) {
    console.log('allStudents get error', err);
    res.status(500).json({ err: err.message });
  }
};

exports.getComment = async (req, res) => {
  const { name, group, date } = req.query;
  try {
    const student = await Student.findOne(
      { name, group, 'history.date': new Date(parseInt(date)) },
      { history: 1 }
    ).lean();
    if (student) {
      const lastRecord = student.history[student.history.length - 1];
      res.status(200).json({ rating: lastRecord.rating, comment: lastRecord.comment });
    } else {
      res.status(200).json({ rating: null, comment: null });
    }
  } catch (err) {
    console.log('getComment error', err);
    res.status(500).json({ err: err.message });
  }
};

exports.updStudent = async (req, res) => {
  const { name, groupId, historyEl } = req.body;

  try {
    let student = await Student.findOne({ name: name, group: groupId });
    if (!student) {
      student = new Student({ name, group: groupId, history: [historyEl] });
    } else {
      let index = student.history.findIndex((history) => history.date.getTime() === historyEl.date);

      if (index === -1) student.history.push(historyEl);
      else student.history[index] = historyEl;
    }
    await student.save();
    res.status(200).json({ message: 'ok' });
  } catch (err) {
    console.log('updStudent error', err);
    res.status(500).json({ err: err.message });
  }
};

// name: String,
//   group: String,
//   history: [{type: Object, phase: Number, groupType: String, date: Date, teacher: String, comment: String}]