const { Schema, model } = require("mongoose")

const tHistorySchema = new Schema(
  {
    crtable: {
      online: [{ crDay: String, tableData: [] }],
      offline: [{ crDay: String, tableData: [] }]
    }
  },
  {
    timestamps: true
  }
)
module.exports = model("TablesHistory", tHistorySchema)
