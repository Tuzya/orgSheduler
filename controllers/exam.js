const Group = require('../models/Group');
const Student = require('../models/Student');
const {
  getSheetData,
  duplicateSheet,
  selectSheetProperties,
  appendDataToSheet
} = require('../tools/googleSheet');

module.exports = {
  createExam: async (req, res) => {
    const { groupId, repository } = req.body;
    try {
      const group = await Group.findOne({ _id: groupId });
      const students = await Student.find({ group: group._id });
      const studentSheet = await getSheetData(group.name);
      const studentsData = studentSheet.data.values;
      studentsData.splice(0, 2);
      const stud = studentsData
        .filter((student) => student[1])
        .map((student) => ({
          name: student[1],
          github: repository.replace('Elbrus-Bootcamp', student[5].split('/').pop())
        }));

      const t = await duplicateSheet(group);
      const { sheetId: newSheetId, title: newSheetTitle } = selectSheetProperties(t);
      await appendDataToSheet(newSheetTitle, stud);

      res.sendStatus(200)
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }
};
