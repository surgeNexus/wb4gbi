const express = require('express');
const router = express.Router();
const moment = require('moment');
const middleware = require('../middleware/index');
const Repeater = require('../models/Repeater');
const Article = require('../models/Article');

router.get('/:article/:repeater/edit', middleware.isLoggedIn, (req, res) => {
  Repeater.find({}, (err, foundRepeaters) => {
    if(err){console.log(err)}
    Repeater.findById(req.params.repeater, (err, foundRepeater) => {
      if(err){console.log(err)}
    
      Article.findById(req.params.article, (err, foundArticle) => {
        if(err){
          console.log(err);
        } else {
          res.render('article/edit', {
            repeaters: foundRepeaters,
            repeater: foundRepeater,
            article: foundArticle
          });
        }
      });
    });
  });
});

router.put('/:article/:repeater/edit', middleware.isLoggedIn, (req, res) => {
  Repeater.findById(req.params.repeater, (err, foundRepeater) => {
    if(err){console.log(err)}
    Article.findById(req.params.article, (err, foundArticle) => {
      if(err){
        console.log(err);
      } else if(!req.files) {
        foundArticle.name = req.body.name;
        foundArticle.text = req.body.text;
        foundArticle.save();
        res.redirect('/repeater/' + foundRepeater.frequency);
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
        foundArticle.name = req.body.name;
        foundArticle.text = req.body.text;
        foundArticle.image = movedImage;
        foundArticle.save();
        res.redirect('/repeater/' + foundRepeater.frequency);
      }
    });
  });
});

module.exports = router;