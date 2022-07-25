const { Schema, model } = require("mongoose")

const teachersTimeSchema = new Schema({
  online: { teachers: [String], timegaps: [String] },
  offline: { teachers: [String], timegaps: [String] }
})

module.exports = model("TeachersTime", teachersTimeSchema)
