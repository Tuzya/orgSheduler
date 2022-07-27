const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const groupSchema = new Schema({
  name: String,
  phase: { type: Number, default: 1 },
  online: { type: Boolean, default: false },
  groupType: String,
  students: { type: [String], default: [] },
  shedule: Object,
  crshedule: {
    type: Object,
    days: {
      type: Object,
      mon: Boolean,
      tue: Boolean,
      wed: Boolean,
      thu: Boolean,
      fri: Boolean,
    },
  },
  crtables: [{crDay: String, tableData: [{}]}],
  isArchived: {type: Boolean, default: false}
});


module.exports = model("Group", groupSchema);
