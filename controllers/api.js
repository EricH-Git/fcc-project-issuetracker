const Issue = require('../modules/issues.js');


function IssueHandler() {

  // this.getIssue = async function(project, issueQueries) {
    // let result;
    // if (!issueQueries) {
    //   result = await Issue.find({ project });
    // } else {
    //   result = await Issue.find({...issueQueries, project});
    // }
    // return result;
  // }

  // this.postIssue = async function(projectName ,issueData) {
  //   const { issue_title, issue_text, created_by, assigned_to, status_text } = issueData;
  //   const currentDate = new Date().toISOString();
  //   const issue = await new Issue({
  //     project: projectName,
  //     issue_title: issue_title,
  //     issue_text: issue_text,
  //     created_on: currentDate,
  //     updated_on: currentDate,
  //     created_by: created_by,
  //     assigned_to: assigned_to,
  //     status_text: status_text
  //   });

  //   const result = await issue.save().catch((err) => { throw error('required field(s) missing' ) });

  //   return result;
  // }

  // this.updateIssue = async function(issueData) {
    // const issueId = issueData._id;
    // if (!issueId) { return { error: 'missing _id' } };
    // const updateData = await Object.fromEntries(Object.entries(issueData).filter(d => {
    //   if (d[1] === '' || d[0] === '_id') {
    //     return false
    //   } else {
    //     return true
    //   }
    // }));
    // let result;

    // let find = await Issue.findByIdAndUpdate(issueId, { ...updateData, updated_on: new Date().toISOString() }, { new: true }, (err, res) => {
    //   if (err || !res) { return result = { error: 'could not update', _id: issueId }};
    //   return result = { result: 'successfully updated', _id: issueId };
    // }).catch(err => result = { error: 'could not update', _id: issueId });

    // return result;
  // }

  this.deleteIssue = async function(issueId) {
    if (!issueId._id) { return { error: 'missing _id' } };

    let result;

    await Issue.deleteOne(issueId, (err, res) => {
      if (err || res.deletedCount === 0) { return result = { error: 'could not delete', '_id': issueId } };
      return result = { result: 'successfully deleted', _id: issueId };
    }).catch(err =>  result = { error: 'could not delete', _id: issueId });

    return result;

  }

  
}

module.exports = IssueHandler;