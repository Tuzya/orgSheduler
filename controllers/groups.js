const Group = require('../models/Group');

exports.allGroups = async (req, res) => {
  try {
    const allTheGroups = await Group.find().lean();
    res.status(200).json(allTheGroups);
  } catch (err) {
    console.log('updGroup error', err);
    res.status(500).json({ err: err.message });
  }
};

exports.groups = async (req, res) => {
  const group = await Group.findById(req.params.id).lean();
  res.json(group);
};

exports.createGroup = async (req, res) => {
  const { phase, students, shedule, name, groupType } = req.body;
  try {
    const group = await Group.create({
      name,
      phase,
      students,
      shedule,
      groupType
    });
    res.status(201).json(group);
  } catch (err) {
    console.log('createGroup error', err);
    res.status(500).send(err);
  }
};

exports.updGroup = async (req, res) => {
  const { id } = req.params;
  const { phase, students, shedule, name, groupType } = req.body;
  try {
    const group = await Group.updateOne(
      { _id: id },
      {
        name,
        phase,
        students,
        shedule,
        groupType
      }
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
    res.json(await Group.findByIdAndDelete(id));
  } catch (err) {
    res.status(500).json(err);
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
