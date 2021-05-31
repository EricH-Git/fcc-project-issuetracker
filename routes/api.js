'use strict';
const mongoose = require('mongoose');

const Issue = require('../modules/issues.js');


module.exports = function (app) {


  app.route('/api/test')
    .get((req, res) => {
      res.json({'response': mongoose.connection.readyState});
    });

  app.route('/api/issues/:project')
  
    .get(async function(req, res){
      try {
        let project = req.params.project;
        let issueData =  req.query;
        let data ;
        if (!issueData) {
          data = await Issue.find({ project });
        } else {
          data = await Issue.find({...issueData, project});
        };
        res.json(data);

      } catch (err) {
        console.log(err.message);
        res.send('invalid input!');
      }
      
    })
    
    .post(async function(req, res){
      try {
        let issueData;
        let project = req.params.project;

        if (Object.keys(req.body).length === 0) {
          issueData = req.query;
        } else {
          issueData = req.body;
        }

        const { issue_title, issue_text, created_by, assigned_to, status_text } = issueData;
        const currentDate = new Date().toISOString();
        const issue = await new Issue({
          project: project,
          issue_title: issue_title,
          issue_text: issue_text,
          created_on: currentDate,
          updated_on: currentDate,
          created_by: created_by,
          assigned_to: assigned_to,
          status_text: status_text
        });

        const testNewIssue = await issue.validateSync();

        const data = await issue.save();

        res.json({
            '_id': data._id,
            'issue_title': data.issue_title,
            'issue_text': data.issue_text,
            'created_on': data.created_on,
            'updated_on': data.updated_on,
            'created_by': data.created_by,
            'assigned_to': data.assigned_to,
            'status_text': data.status_text,
            'open': data.open
          });

      } catch (err) {
       console.log(err.message);
       if (err.name === 'ValidationError') {
         res.json({ error: 'required field(s) missing' })
       } else {
        res.json({ error: err.message }); 

       }
      
      }
    })
    
    .put(async function(req, res){
      let updateData;
      let issueId;
      try {


        if (Object.keys(req.body).length === 0) {
          updateData = req.query
        } else {
          updateData = req.body;
        }

        issueId = updateData._id;

        if (!issueId) { throw { error: 'missing _id' }; };

        const filteredData = await Object.fromEntries(
          Object.entries(updateData).filter(d => {
            if (d[1] === '' || d[0] === '_id') {
              return false
            } else {
              return true
            }
          })
        );
        
        if (Object.keys(filteredData).length === 0) { throw { error: 'no update field(s) sent', '_id': issueId } }

        let find = await Issue.findByIdAndUpdate(
          issueId,
          { ...updateData, updated_on: new Date().toISOString() }
        ).orFail({ error: 'could not update', _id: issueId });


        res.json({  result: 'successfully updated', '_id': issueId });
      } catch (err) {

        console.log(err);
        if(err.name === 'CastError') {
          res.json({ error: 'could not update', _id: issueId })
        } else {
          res.json(err);
        };
      }
    })
    
    .delete(async function (req, res){
      let issueId;

      if (Object.keys(req.body).length === 0) {
        issueId = req.query._id;
      } else {
        issueId = req.body._id;
      }

      try {

        if (!issueId) { throw { error: 'missing _id' } };

        const deleted = await Issue.deleteOne({ _id: issueId })
        .orFail({ error: 'could not delete', _id: issueId });

        res.json({ result: 'successfully deleted', _id: issueId });

      } catch (err) {
        console.log(err);
        if(err.name === 'CastError') {
          res.json({ error: 'could not delete', _id: issueId })
        } else {
          res.json(err);
        };

      }

    });
    
    
};
