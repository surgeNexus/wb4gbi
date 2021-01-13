const express = require('express');
const router = express.Router();
const moment = require('moment');
const fs = require('fs');
const middleware = require('../middleware/index');
const Repeater = require('../models/Repeater');
const Article = require('../models/Article');

router.get('/new', middleware.isLoggedIn, (req, res) => {
  Repeater.find({}, (err, foundRepeaters) => {
      if(err){
          console.log(err);
      } else {
          res.render('repeater/new', {
              repeaters: foundRepeaters
          });
      }
    });
});

router.post('/new', middleware.isLoggedIn, (req, res) => {
  if(!req.files){
    const newRepeater = {
      frequency: req.body.frequency,
      tone: req.body.tone,
      location: req.body.location,
      status: req.body.status,
      statusText:req.body.statusText
    }
    Repeater.create(newRepeater, (err, repeater) => {
      if(err){
          console.log(err);
      } else {
          res.redirect('/repeater/' + repeater.frequency);
      }
    });
  } else {
    var now = moment();
    let newImage = req.files.image;
    newImage.mv(
      './public/uploads/' + now + newImage.name,
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
    var movedImage = '/uploads/' + now + newImage.name;
    const newRepeater = {
      frequency: req.body.frequency,
      tone: req.body.tone,
      location: req.body.location,
      status: req.body.status,
      statusText:req.body.statusText,
      image: movedImage
    }
    Repeater.create(newRepeater, (err, repeater) => {
      if(err){
          console.log(err);
      } else {
          res.redirect('/repeater/' + repeater.frequency);
      }
    });
  }
});

router.get('/:repeater/edit', middleware.isLoggedIn, (req, res) => {
  Repeater.find({}, (err, foundRepeaters) => {
    if(err){
      console.log(err);
    } else {
      Repeater.findById(req.params.repeater, (err, foundRepeater) => {
        if(err){
          console.log(err);
        } else {
          res.render('repeater/edit', {
            repeaters: foundRepeaters,
            repeater: foundRepeater
          });
        }
      });
    }
  });
});

router.put('/:repeater_id/edit', middleware.isLoggedIn, (req, res) => {
  if(!req.files){
    Repeater.findById(req.params.repeater_id, (err, repeater) => {
      if(err){
        console.log(err);
      } else {
        repeater.frequency = req.body.frequency;
        repeater.tone = req.body.tone;
        repeater.location = req.body.location;
        repeater.status = req.body.status;
        repeater.statusText = req.body.statusText;
        repeater.save();
        res.redirect('/repeater/' + repeater.frequency);
      }
    });
  } else {
    var now = moment();
    let newImage = req.files.image;
    newImage.mv(
      './public/uploads/' + now + newImage.name,
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
    var movedImage = '/uploads/' + now + newImage.name;
    Repeater.findById(req.params.repeater_id, (err, repeater) => {
      if(err){
          console.log(err);
      } else {
        repeater.frequency = req.body.frequency;
        repeater.tone = req.body.tone;
        repeater.location = req.body.location;
        repeater.status = req.body.status;
        repeater.statusText = req.body.statusText;
        repeater.image = movedImage;
        repeater.save();
        res.redirect('/repeater/' + repeater.frequency);
      }
    });
  }
});

router.get('/:freq', (req, res) => {
  Repeater.find({}).sort({frequency: -1}).exec((err, foundRepeaters) => {
      if(err){console.log(err)}
      Repeater.findOne({frequency: req.params.freq}).populate('articles').exec((err, foundRepeater) => {
        if(err){
          console.log(err);
        } else {
          res.render('repeater', {
            repeaters: foundRepeaters,
            repeater: foundRepeater
          });
        }
      });
  });
});

router.post('/:repeater/article/new', middleware.isLoggedIn, (req, res) => {
  Repeater.findById(req.params.repeater, (err, foundRepeater) => {
    if(err){ 
      console.log(err);
    } else {
      if(!req.files) {
        const newArticle = {
          name: req.body.name,
          text: req.body.text
        }
        Article.create(newArticle, (err, article) => {
          if(err){console.log(err)}
          foundRepeater.articles.push(article);
          foundRepeater.save();
          res.redirect('back');
        });
      } else {
        var now = moment();
        let newImage = req.files.image;
        newImage.mv(
          './public/uploads/' + now + newImage.name,
          function (err) {
            if (err) {
              console.log(err);
            }
          }
        );
        var imgLoc = '/uploads/' + now + newImage.name;
        console.log(imgLoc)
        const newArticle = {
          name: req.body.name,
          text: req.body.text,
          image: imgLoc,
        }
        Article.create(newArticle, (err, article) => {
          if(err){console.log(err)}
          foundRepeater.articles.push(article);
          foundRepeater.save();
          res.redirect('back');
        });
      }
    }
  });
});

module.exports = router;
