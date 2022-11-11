const Group = require('../models/Group');
const Student = require('../models/Student');

exports.allGroups = async (req, res) => {
  const { name = '' } = req.query;
  try {
    const allTheGroups = await Group.find({ name: { $regex: name, $options: 'i' } }).lean();
    const stidentsPr = allTheGroups.map((group) => Student.find({ group: group._id }, {_id: 1, name: 1}).lean());
    const students = await Promise.all(stidentsPr);
    allTheGroups.forEach((group, i) => {group.students = students[i]})
    res.status(200).json(allTheGroups);
  } catch (err) {
    console.error('allGroups error', err.message);
    res.status(500).json({ err: err.message });
  }
};

exports.groups = async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id }).lean();
    if (group) group.students = await Student.find({group: group._id}).lean();
    res.status(200).json(group);
  } catch (err) {
    console.error('getGroup error', err.message);
    if (err.name === 'CastError') return res.status(404).json({ err: err.message });
    res.status(500).json({ err: err.message });
  }
};

exports.createGroup = async (req, res) => {
  const { phase, students, shedule, name, groupType } = req.body;
  try {
    const group = await Group.createGroupAndStudents(name, phase, students, shedule, groupType);
    res.status(201).json(group);
  } catch (err) {
    // console.log('createGroup error', err.name);
    // console.log('createGroup error', err.code);
    // console.log('createGroup error', err.keyValue);
    if (err.code === 11000)
      return res
        .status(400)
        .json({ err: `This record already exist ${JSON.stringify(err.keyValue)}` });
    res.status(500).json({ err: err.message });
  }
};

exports.updGroup = async (req, res) => {
  const { id } = req.params;
  const { phase, students, deletedStudents, shedule, name, groupType } = req.body;
  try {
    const group = await Group.updateGroupAndStudents(
      id,
      name,
      phase,
      students,
      deletedStudents,
      shedule,
      groupType
    );
    res.status(200).json({ message: 'ok', group });
  } catch (err) {
    console.log('updGroup error', err);
    res.status(500).json({ err: err.message });
  }
};

exports.updCRTablesGroup = async (req, res) => {
  const { id } = req.params;
  const { crtables } = req.body;
  try {
    const updRes = await Group.updateOne({ _id: id }, { crtables });
    res.status(200).json({ message: 'ok', updRes });
  } catch (err) {
    console.log('updCRTables Group error', err);
    res.status(500).json({ err: err.message });
  }
};

exports.delGroup = async (req, res) => {
  const { id } = req.params;
  try {
    const delRes = await Group.deleteGroupAndStudents(id);
    res.json(delRes);
  } catch (err) {
    console.error('Delete group Error', err.message);
    res.status(500).json({ err: err.message });
  }
};

exports.updAllGroups = async (req, res) => {
  const { groups = [] } = req.body;
  try {
    await Promise.all(
      groups.map((group) => Group.updateOne({ _id: group._id }, { crshedule: group.crshedule }))
    );
    res.status(200).json({ message: 'ok' });
  } catch (err) {
    console.log('Error to update group CodeReview Schema', err.message);
    res.status(500).json({ err: err.message });
  }
};
