const Group = require('../models/Group');
const Student = require('../models/Student');

module.exports = {
    createExam: async (req,res) => {
        const {groupId} = req.body
        try {
            const group = await Group.findOne({ _id: groupId })
            const students = await Student.find({group: group._id})
            console.log(req.body)
            res.json({group, students})
        } catch (error) {
            res.status(400).json({msg: error.message})
        }
    }
}

// try {
//     const delRes = await Group.deleteGroupAndStudents(id);
//     res.json(delRes);
//   } catch (err) {
//     console.error('Delete group Error', err.message);
//     res.status(500).json({ err: err.message });
//   }