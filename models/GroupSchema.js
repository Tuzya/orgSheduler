const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const groupSchema = new Schema({
 offline: {type: Object},
 online: {type: Object},
 phase: {type: String}
});

module.exports = model("GroupSchema", groupSchema);
