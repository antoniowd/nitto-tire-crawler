const mongoose = require('mongoose');

const schema = mongoose.Schema({
  seed: { type: Object, required: true },
  result: { type: String, required: true },
  status: { type: String, required: true, enum: ['Active'] },
  updatedAt: { type: Date, required: true, default: Date.now() }
});

module.exports = mongoose.model('NtTemp', schema);