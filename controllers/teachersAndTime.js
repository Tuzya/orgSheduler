const TeachersTime = require('../models/TeachersTime');

exports.allTeachersAndTime = async (req, res) => {
  try {
  const teachersTime = await TeachersTime.findOne({}, { _id: 0 });
  res.status(200).json(teachersTime);
  } catch (err) {
    console.log('teachersAndTime get error', err);
    res.status(500).json({ err: err.message });
  }
};

exports.updTeachersAndTime = async (req, res) => {
  const { teachers, timegaps, key } = req.body;
  try {
    let teachersTime = await TeachersTime.findOne({}, { _id: 0 });
    if (!teachersTime) {
      teachersTime = new TeachersTime({ [key]: { teachers, timegaps } });
    } else {
      teachersTime[key] = { teachers, timegaps };
    }
    await teachersTime.save();
    res.status(200).json({ message: 'ok' });
  } catch (err) {
    console.log('teachersAndTime update error', err);
    res.status(500).json({ err: err.message });
  }
};
