const { Schema, model } = require('mongoose');

const tHistorySchema = new Schema({
  crtable: [{crDay: String, tableData: []}]
},
  {
    timestamps: true
  });
module.exports = model('TablesHistory', tHistorySchema);
