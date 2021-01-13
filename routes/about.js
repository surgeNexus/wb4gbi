const express = require('express');
const router = express.Router();
const fs = require('fs');
const moment = require('moment');
const middleware = require('../middleware/index');
const Repeater = require('../models/Repeater');
const About = require('../models/About');

router.get('/', (req, res) => {
    Repeater.find({}, (err, foundRepeaters) => {
        if(err){console.log(err); res.redirect('back')}
        About.find({}, (err, foundAbouts) => {
            if(err){console.log(err); res.redirect('back')}
            res.render('about/index', {
                repeaters: foundRepeaters,
                abouts: foundAbouts
            });
        });
    });
});

router.post('/', middleware.isLoggedIn, (req, res) => {
        if(!req.files){
        const newAbout = {
            title: req.body.title,
            text: req.body.text
        }
        About.create(newAbout, (err, about) => {
            if(err){console.log(err); res.redirect('back')}
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
        let newImage2 = req.files.image2;
        newImage2.mv(
          './public/uploads/' + now + newImage2.name,
          function (err) {
            if (err) {
              console.log(err);
            }
          }
        );
        let newImage3 = req.files.image3;
        newImage3.mv(
          './public/uploads/' + now + newImage3.name,
          function (err) {
            if (err) {
              console.log(err);
            }
          }
        );
        var movedImage = '/uploads/' + now + newImage.name;
        var movedImage2 = '/uploads/' + now + newImage2.name;
        var movedImage3 = '/uploads/' + now + newImage3.name;
        const newAbout = {
            title: req.body.title,
            text: req.body.text,
            image: movedImage,
            image2: movedImage2,
            image3: movedImage3,
        }
        About.create(newAbout, (err, about) => {
            if(err){console.log(err); res.redirect('back')}
            res.redirect('back');
        });
    } 
});

router.get('/:about/edit', middleware.isLoggedIn, (req, res) => {
    Repeater.find({}, (err, foundRepeaters) => {
        if(err){console.log(err); res.redirect('back')}
        About.findById(req.params.about, (err, foundAbout) => {
            if(err){console.log(err); res.redirect('back')}
            res.render('about/edit', {
                repeaters: foundRepeaters,
                about: foundAbout
            });
        });
    });
});

router.put('/:about/edit', middleware.isLoggedIn, (req, res) => {
    About.findById(req.params.about, (err, about) => {
    if(!req.files){
        if(err){console.log(err); res.redirect('back')}
        about.title = req.body.title;
        about.text = req.body.text;
        about.save()
        res.redirect('back');
    } else {
        var now = moment();
        let newImage = req.files.image;
        if(newImage){
            newImage.mv(
              './public/uploads/' + now + newImage.name,
              function (err) {
                if (err) {
                  console.log(err);
                }
              }
            );
        }
        let newImage2 = req.files.image2;
        if(newImage2){
            newImage2.mv(
              './public/uploads/' + now + newImage2.name,
              function (err) {
                if (err) {
                  console.log(err);
                }
              }
            );
        }
        let newImage3 = req.files.image3;
        if(newImage3){
            newImage3.mv(
              './public/uploads/' + now + newImage3.name,
              function (err) {
                if (err) {
                  console.log(err);
                }
              }
            );
        }
        var movedImage = '/uploads/' + now + newImage.name;
        var movedImage2 = '/uploads/' + now + newImage2.name;
        var movedImage3 = '/uploads/' + now + newImage3.name;
            about.title = req.body.title;
            about.text = req.body.text;
            about.image = movedImage,
            about.image2 = movedImage2,
            about.image3 = movedImage3,
            about.save()
            res.redirect('back');
        }
    });
});

module.exports = router;
