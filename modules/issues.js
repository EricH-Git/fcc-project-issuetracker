const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const issueSchema = new Schema({
  "project": { type: String, required: true },
  "issue_title": { type: String, required: true },
  "issue_text": { type: String, required: true },
  "created_on": { type: String, required: true },
  "updated_on": { type: String, required: true },
  "created_by": { type: String, required: true },
  "assigned_to": { type: String, default: '' },
  "open": { type: Boolean, default: true },
  "status_text": { type: String, default: '' } 
}, { versionKey: false });

const Issue = mongoose.model('issues', issueSchema);

module.exports = Issue;