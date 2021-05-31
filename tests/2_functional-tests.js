const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
require('dotenv').config();
chai.use(chaiHttp);

suite('Functional Tests', function() {
  let testId;

  test('POST new project', function(done) {
    chai.request(server)
      .post('/api/issues/functionaltest')
      .type('form')
      .send({
        issue_title: 'test',
        issue_text: 'this is a test',
        created_by: 'chai',
        assigned_to: 'mongoose',
        status_text: 'posting new issue'
      })
      .end((err, res) => {;
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an Object');
        assert.property(res.body, '_id', 'response should have an id');
        assert.property(res.body, 'created_on', 'response should have a property of created_on');
        assert.property(res.body, 'updated_on', 'response should have a property of updated_on');
        assert.equal(res.body.issue_title, 'test');
        assert.equal(res.body.issue_text, 'this is a test');
        assert.equal(res.body.created_by, 'chai');
        assert.equal(res.body.assigned_to, 'mongoose');
        assert.equal(res.body.status_text, 'posting new issue');
        testId = res.body._id;
      });
    done();
  });

  test('POST new project required only', function(done) {
    chai.request(server)
      .post('/api/issues/functionaltest')
      .type('form')
      .send({
        issue_title: 'test 2',
        issue_text: 'this is a test for required only',
        created_by: 'chai'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an Object');
        assert.property(res.body, '_id', 'response should have an id');
        assert.property(res.body, 'created_on', 'response should have a property of created_on');
        assert.property(res.body, 'updated_on', 'response should have a property of updated_on');
        assert.equal(res.body.issue_title, 'test 2');
        assert.equal(res.body.assigned_to, '');
        assert.equal(res.body.status_text, '');
        assert.equal(res.body.issue_text, 'this is a test for required only');
        assert.equal(res.body.created_by, 'chai');
      });
    done();
  });

  test('POST new project missing required', function(done) {
    chai.request(server)
      .post('/api/issues/functionaltest')
      .type('form')
      .send({
        assigned_to: 'mongoose',
        status_text: 'posting new issue without required'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error', 'response should be an error');
        assert.equal(res.body.error, 'required field(s) missing', 'response should be a missing fields error');
      });
    done();
  });

  test('GET project request', function(done) {
    chai.request(server)
      .get('/api/issues/functionaltest')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        res.body.forEach(issue => {
          assert.property(issue, '_id', 'each issue should have an id');
          assert.property(issue, 'issue_title', 'each issue should have an issue_title');
          assert.property(issue, 'assigned_to', 'each issue should have a property of assigned_to');
          assert.property(issue, 'status_text', 'each issue should have a property of status_text');
          assert.property(issue, 'issue_text', 'each issue should have a property of issue_text');
          assert.property(issue, 'created_by', 'each issue should have a property of issue_text');
          assert.property(issue, 'created_on', 'response should have a property of created_on');
          assert.property(issue, 'updated_on', 'response should have a property of updated_on');
        });
      });
    done();
  });

  test('GET project request with a single filter', function(done) {
    chai.request(server)
      .get('/api/issues/functionaltest')
      .send({ created_by: 'chai' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        res.body.forEach(issue => {
          assert.equal(issue.created_by, 'chai', 'issues should all fit the filter'); 
          assert.property(issue, '_id', 'each issue should have an id');
        });
      });
    done();
  });

  test('GET project request with multiple filters', function(done) {
    chai.request(server)
      .get('/api/issues/functionaltest')
      .send({ created_by: 'chai', open: true })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        res.body.forEach(issue => {
          assert.equal(issue.created_by, 'chai', 'issues should all fit the filter'); 
          assert.equal(issue.open, true, 'issues should all fit the filter'); 
          assert.property(issue, '_id', 'each issue should have an id');
        });
      });
    done();
  });


  test('PUT request to update one field', function(done) {
    chai.request(server)
      .put('/api/issues/functionaltest')
      .send({ status_text: 'this is updated', '_id': testId })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an object');
        assert.property(res.body, 'result', 'response should have a result');
      });
    done();
  });

  test('PUT request to update multiple fields', function(done) {
    chai.request(server)
      .put('/api/issues/functionaltest')
      .send({ status_text: 'this is updated again', issue_text: 'this is also updated' , '_id': testId })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an object');
        assert.property(res.body, 'result', 'response should have a result');
      });
    done();
  });

  test('PUT request with missing _id', function(done) {
    chai.request(server)
      .put('/api/issues/functionaltest')
      .send({ status_text: 'this shouldnt update anything' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an object');
        assert.property(res.body, 'error', 'should return an error');
      });
    done();
  });

  test('PUT request with no update fields', function(done) {
    chai.request(server)
      .put('/api/issues/functionaltest')
      .send({ _id: testId })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an object');
        assert.property(res.body, 'error', 'should return an error');
      });
      done();
  });

  test('PUT request with invalid id', function(done) {
    chai.request(server)
      .put('/api/issues/functionaltest')
      .send({ status_text: 'this shouldnt update', issue_text: 'this also shouldnt update' , _id: '11notarealid11' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an object');
        assert.property(res.body, 'error', 'response should return an error');
      });
    done();
  });

  test('DELETE request', function(done) {
    chai.request(server)
      .delete('/api/issues/functionaltest')
      .send({ _id: testId })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an object');
        assert.property(res.body, 'result', 'response should return a result');
      });
    done();
  });

  test('DELETE request with invalid _id', function(done) {
    chai.request(server)
      .delete('/api/issues/functionaltest')
      .send({ _id: '11notarealid11' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an object');
        assert.property(res.body, 'error', 'response should return a error');
      });
    done();
  });

  test('DELETE request missing _id', function(done) {
    chai.request(server)
      .delete('/api/issues/functionaltest')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an object');
        assert.property(res.body, 'error', 'response should return a error');
      });
    done();
  });

});
