/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
const MONGODB_CONNECTION_STRING = process.env.DB;
var MongoClient = require('mongodb').MongoClient;
var expect = require('chai').expect;
const shortid = require('shortid');
var ObjectId = require('mongodb').ObjectId;

module.exports = function (app) {
  app.route('/api/threads/:board') 
  //DONE!!
    .get(function (req, res){
     MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        var dbo = db.db("messageboard");
        
           //get the 10
            dbo.collection("messages").find({}).project({reported: 0, delete_passwords: 0}).sort({x:-1}).limit(10).toArray(function(err, result) {
              if(result == null || result == "") {
                res.json({error: "no records found! Add a thread first!"});
              }
              else {
                var messageArray = [];
                var repliesArray = [];

                for(var k=0; k<result.length; k++) {
                   for(var i=0; i<result[k].replies.length; i++) {
                      if(i < 3) {
                        repliesArray.push(result[k].replies[i]);
                      }
                    }
                  messageArray.push({_id: result[k]._id, text: result[k].text, created_on: result[k].created_on, bumped_on: result[k].bumped_on, replies: repliesArray, replycount: result[k].replies.length})
                  repliesArray = [];
                }
                
                res.json(messageArray);
              }
            });
     });
    
    })
  
  //DONE!!
    .post(function (req, res){
      var _id = new ObjectId();
      var board = req.params.board;
      var text = req.body.text;
      var created_on = new Date();
      var bumped_on = created_on;
      var reported = false;
      var delete_password = req.body.delete_password;
      var replies = [];
    
      //response will contain new book object including atleast _id and title
      var toBeAdded = {_id: _id, board: board, text: text, created_on: created_on, bumped_on: bumped_on, reported: reported, delete_password: delete_password, replies: replies};
    
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
          if (err) throw err;
            var dbo = db.db("messageboard");
        
        dbo.collection("messages").insertOne(toBeAdded, function(err, res) {
              if (err) throw err;
              db.close();
        });    
      });
    
      res.redirect('/b/'+board);
    })
  
  //DONE!!
  .delete(function(req, res){
      var thread_id = req.body.thread_id;
      var delete_password = req.body.delete_password  
    
      //if successful response will be 'complete delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
          if (err) throw err;
            var dbo = db.db("messageboard");
        
        dbo.collection("messages").deleteOne({_id: ObjectId(thread_id), delete_password: delete_password}, function(err, obj) {
            if (err) throw err;
            res.send('complete delete successful');
        });
      });
    })
  
  //DONE
   .put(function (req, res){
      var thread_id = req.body.thread_id;
      var board = req.params.board;

      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
          if (err) throw err;
            var dbo = db.db("messageboard");
        
        var newvalues = { $set: {reported: true} };
        
        dbo.collection("messages").updateOne({_id: ObjectId(thread_id), board: board}, newvalues, function(err, r) {
          if(err == null || err == "") {
               res.send('success'); 
            }
            else {
              res.send('invalid ID'); 
            }
        });
      });
   })
    
  app.route('/api/replies/:board')
    //DONE
    .get(function (req, res){
      var thread_id = req.query.thread_id;
      var board = req.params.board;
      
     MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
       if (err) throw err;
        var dbo = db.db("messageboard");
        
            dbo.collection("messages").findOne({_id: ObjectId(thread_id)}, {board:0, reported: 0, delete_password: 0}, function(err, result) {
              if(result == null || result == "") {
                res.json({error: "no records found!"});
              }
              else {
                res.json(result);
              }
            });
     });
    })
  
  //DONE
    .post(function (req, res){
      var board = req.params.board;
      var _id = new ObjectId();
      var thread_id = req.body.thread_id;
      var text = req.body.text;
      var delete_password = req.body.delete_password;
      var today = new Date();
    
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
          if (err) throw err;
            var dbo = db.db("messageboard");
        
        var updatedmessagesarray = {_id: _id, text: text, created_on: today, delete_password: delete_password, reported: false};
        var newvalues = { $addToSet: { replies: updatedmessagesarray}, $set: { bumped_on: today }};

        dbo.collection("messages").updateOne({_id: ObjectId(thread_id)}, newvalues, function(err, res) {
            if (err) throw err;
        });
        
        res.redirect('/b/'+board+'/'+thread_id);
      });
    })
  
  //DONE
    .delete(function(req, res){
      var thread_id = req.body.thread_id;
      var reply_id = req.body.reply_id;
      var delete_password = req.body.delete_password;  
    
      //res.send(thread_id + '  ' +  reply_id + '  ' + delete_password);
    
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
          if (err) throw err;
            var dbo = db.db("messageboard");
        
        var newvalues = { $set: {'replies.$.text': '[deleted]'} };
        
        dbo.collection("messages").findOne({_id: ObjectId(thread_id), replies: { $elemMatch: { _id: ObjectId(reply_id), delete_password: delete_password }}}, function(err, r) {
          if(r == null || r == "") {
            res.send('incorrect password!');
          }
          else {
            dbo.collection("messages").updateOne({_id: ObjectId(thread_id), replies: { $elemMatch: { _id: ObjectId(reply_id), delete_password: delete_password }}}, newvalues, function(err, r2) {
              if (err) throw err;
            });
            res.send('success');
          }
        });  
    });
  })
  
    //DONE
  .put(function (req, res){
      var thread_id = req.body.thread_id;
      var reply_id = req.body.reply_id;  
    
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
          if (err) throw err;
            var dbo = db.db("messageboard");
        
        var newvalues = { $set: {'replies.$.reported': true } };
        
        dbo.collection("messages").updateOne({_id: ObjectId(thread_id), replies: { $elemMatch: { _id: ObjectId(reply_id)}}}, newvalues, function(err, r2) {
            if (err) throw err;
            res.send('success');
        });
      });
   })
  
}