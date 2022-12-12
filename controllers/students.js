const Student = require('../models/Student');
const Group = require('../models/Group');

exports.createStudents = async (req, res) => {
  const {studentsNamesArr, groupId} = req.body;
  try {
    const students = await Student.createStudents(studentsNamesArr, groupId);
    res.status(200).json(students);
  } catch (err) {
    console.log('createStudents error', err);
    if (err.code === 11000)
      return res
        .status(400)
        .json({ err: `This record already exist ${JSON.stringify(err.keyValue)}` });
    res.status(500).json({ err: err.message });

  }
};

exports.allStudents = async (req, res) => {
  try {
    const {
      name = '',
      groupId = '',
      groupType = '',
      page = 0,
      limit = 0
    } = req.query.search ? JSON.parse(req.query.search) : {};

    let groupIds = [];
    if (groupId) groupIds = [groupId];
    else
      groupIds = await Group.find(
        { groupType: { $regex: groupType, $options: 'i' } },
        { _id: 1 }
      ).lean();

    const query = {
      name: { $regex: name, $options: 'i' },
      group: { $in: groupIds }
    };

    const populateOpt = {
      path: 'group',
      model: 'Group',
      select: { _id: 1, name: 1, groupType: 1 }
    };

    const students = await Student.findActive(query)
      .populate(populateOpt)
      .limit(limit)
      .skip(page * limit)
      .sort({ updatedAt: -1, name: 1 });

    res.status(200).json(students);
  } catch (err) {
    console.log('allStudents get error', err);
    res.status(500).json({ err: err.message });
  }
};

exports.getStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const populateOpt = {
      path: 'group',
      model: 'Group',
      select: { _id: 1, name: 1, phase: 1, groupType: 1 }
    };

    const student = await Student.findById(id, { createdAt: 0, updatedAt: 0, __v: 0 })
      .populate(populateOpt)
      .lean();

    res.status(200).json(student);
  } catch (err) {
    console.log('Student get error', err.message);
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

exports.updComment = async (req, res) => {
  const { name, groupId, historyEl } = req.body;

  try {
    const student = await Student.findOne({ name: name, group: groupId });
    const index = student.history.findIndex((history) => history.date.getTime() === historyEl.date);
    if (index === -1) student.history.push(historyEl);
    else student.history[index] = historyEl;
    await student.save();
    res.status(200).json({ message: 'ok' });
  } catch (err) {
    console.log('updStudent error', err);
    res.status(500).json({ err: err.message });
  }
};


exports.updStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, group_id, photoUrl } = req.body;
    const result = await Student.updateOne(
      { _id: id },
      { name: name, group: group_id, photoUrl: photoUrl }
    );
    res.status(200).json({ message: 'ok' });
  } catch (err) {
    console.log('Student update error', err.message);
    res.status(500).json({ err: err.message });
  }
};

exports.delStudent = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('file-students.js id:', id);
    const inactiveGroup = await Group.findOne({ name: 'Inactive' });
    if(!inactiveGroup) throw new Error('Inactive group did not find. Launch "npm run seed".')
    await Student.updateOne({ _id: id  }, [
      {
        $set: {
          name: { $concat: ['$name', '_', new Date().valueOf().toString(36)] },
          group: inactiveGroup._id
        }
      }
    ]);
    res.status(200).json({ message: 'ok' });
  } catch (err) {
    console.log('Student delete error', err.message);
    res.status(500).json({ err: err.message });
  }
};

