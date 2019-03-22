/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function(done) {
      chai.request(server)
        .post('/api/threads/general')
        .send({
          text: 'moretest',
          delete_password: 'pass'
        })
        .end(function(err, res){
        assert.equal(res.status, 200);
        done();
      });
    });
    
    suite('GET', function(done) {
      chai.request(server)
      .get('/api/threads/general')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body, 'response should be an array');
        assert.property(res.body[0], 'text', 'threads in array should contain text');
        assert.property(res.body[0], 'created_on', 'threads in array should contain created_on');
        assert.property(res.body[0], 'bumped_on', 'threads in array should contain bumped_on');
        assert.property(res.body[0], 'replies', 'threads in array should contain replies');
        assert.property(res.body[0], '_id', 'threads in array should contain _id');
        done();
      });
    });
    
    suite('DELETE', function(done) {
      chai.request(server)
        .delete('/api/threads/general')
        .send({
          thread_id: '5c93a3607a8aff0f3bda2534',
          delete_password: 'd'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.error, "No ID specified!!");
          done();
        });
    });
    
    suite('PUT', function(done) {
      chai.request(server)
        .put('/api/threads/general')
        .send({
          thread_id: '5c944b1694d4b81caeef0674',
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res, 'success'); 
          done();
        });
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function(done) {
      chai.request(server)
        .post('/api/replies/general')
        .send({
          text: 'moretest',
          delete_password: 'pass',
          thread_id: '5c944b1694d4b81caeef0674' 
        })
        .end(function(err, res){
        assert.equal(res.status, 200);
        done();
      });
    });
    
    suite('GET', function(done) {
      chai.request(server)
        .get('/api/replies/general')
        .send({
          thread_id: '5c944b1694d4b81caeef0674'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body, 'response should be an array');
          assert.property(res.body[0], 'text', 'threads in array should contain text');
          assert.property(res.body[0], 'created_on', 'threads in array should contain created_on');
          assert.property(res.body[0], 'bumped_on', 'threads in array should contain bumped_on');
          assert.property(res.body[0], 'replies', 'threads in array should contain replies');
          assert.property(res.body[0], '_id', 'threads in array should contain _id');
          done();
        });
    });
    
    suite('PUT', function(done) {
      chai.request(server)
        .put('/api/replies/general')
        .send({
          thread_id: '5c944b1694d4b81caeef0674',
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res, 'success'); 
          done();
        });
    });
    
    suite('DELETE', function(done) {
      chai.request(server)
        .delete('/api/replies/general')
        .send({
          thread_id: '5c93a3607a8aff0f3bda2534',
          reply_id: '5c944b1d94d4b81caeef0675',
          delete_password: 'g'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res, 'success');
          done();
        });
    });
    
  });

});
