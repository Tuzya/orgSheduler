const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const codeReviewSchema = new Schema({
  schema: [
    {
      type: Object,
      grName: String,
      isChecked: Boolean,
      days: {
        type: Object,
        mon: Boolean,
        tue: Boolean,
        wed: Boolean,
        thu: Boolean,
        fri: Boolean,
      },
    },
  ],
});

module.exports = model("CodeReviewSchema", codeReviewSchema);
