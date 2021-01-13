const express = require('express');
const router = express.Router();
const moment = require('moment');
const middleware = require('../middleware/index');
const Repeater = require('../models/Repeater');
const Home = require('../models/Home');

router.get('/', (req, res) => {
  Repeater.find({}).sort({frequency: 'descending'}).exec((err, foundRepeaters) => {
    if(err){console.log(err)}
    Home.find({}).populate('articles').exec((err, foundHomes) => {
      if(err){
        console.log(err);
      } else {
        res.render('index', {
          repeaters: foundRepeaters,
          homes: foundHomes
        });
      }
    });
  });
});

router.post('/new', middleware.isLoggedIn, (req, res) => {
  if(!req.files) {
    const newArticle = {
      name: req.body.name,
      text: req.body.text
    }
    Home.create(newArticle, (err, home) => {
      if(err){console.log(err)}
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
    const newArticle = {
      name: req.body.name,
      text: req.body.text,
      image: imgLoc,
    }
    Home.create(newArticle, (err, article) => {
      if(err){console.log(err)}
      res.redirect('back');
    });
  }
});

router.get('/:home/edit', middleware.isLoggedIn, (req, res) => {
  Repeater.find({}, (err, foundRepeaters) => {
    if(err){console.log(err); res.redirect('back')}
    Home.findById(req.params.home, (err, foundHome) => {
      if(err){
        console.log(err);
        res.redirect('back');
      } else {
        res.render('home/edit', {
          repeaters: foundRepeaters,
          home: foundHome
        });
      }
    });
  });
});

router.put('/:home/edit', middleware.isLoggedIn, (req, res) => {
    Home.findById(req.params.home, (err, foundArticle) => {
      if(err){
        console.log(err);
      } else if(!req.files) {
        foundArticle.name = req.body.name;
        foundArticle.text = req.body.text;
        foundArticle.save();
        res.redirect('/');
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
        res.redirect('/');
      }
  });
});

module.exports = router;
