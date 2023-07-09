const mongoose = require("mongoose");
const hashSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
  },
  time_created: Date
});

const hashs=mongoose.model("hashs",hashSchema);

module.exports = { hashs };
