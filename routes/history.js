const express = require('express');
const router = express.Router();
const fs = require('fs');
const moment = require('moment');
const middleware = require('../middleware/index');
const Repeater = require('../models/Repeater');
const History = require('../models/History');
const Article = require('../models/Article');

router.post('/new/:repeater', middleware.isLoggedIn, (req, res) => {
    Repeater.findById(req.params.repeater, (err, foundRepeater) => {
        if(err){console.log(err); res.redirect('back')}
        const newHistory = {
            frequency: foundRepeater.frequency,
            repeaterId: foundRepeater.id
        }
        History.create(newHistory, (err, history) => {
            if(err){console.log(err); res.redirect('back')}
            foundRepeater.history = history.id;
            foundRepeater.save();
            res.redirect('/history/' + history.frequency);
        });
    });
});

router.get('/:frequency', (req, res) => {
    Repeater.find({}, (err, foundRepeaters) => {
        if(err){console.log(err); res.redirect('back')}
        History.findOne({frequency: req.params.frequency}).populate('articles').exec((err, foundHistory) => {
            if(err){console.log(err); res.redirect('back')}
            res.render('history', {
                repeaters: foundRepeaters,
                history: foundHistory
            })
        })
    })
})

router.post('/article/:frequency/new', middleware.isLoggedIn, (req, res) => {
    History.findOne({frequency: req.params.frequency}, (err, foundHistory) => {
        if(err){console.log(err); res.redirect('back')}
        Repeater.findById(foundHistory.repeaterId, (err, foundRepeater) => {
            if(err){
                console.log(err);
                res.redirect('back');
            } else if(!req.files) {
                const newArticle = {
                    name: req.body.name,
                    text: req.body.text
                }
                Article.create(newArticle, (err, article) => {
                    if(err){console.log(err); res.redirect('back')}
                    foundHistory.articles.push(article);
                    foundHistory.save();
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
                var movedImage = '/uploads/' + now + newImage.name;
                const newArticle = {
                    name: req.body.name,
                    text: req.body.text,
                    image: movedImage
                }
                Article.create(newArticle, (err, article) => {
                    if(err){console.log(err); res.redirect('back')}
                    foundHistory.articles.push(article);
                    foundHistory.save();
                    res.redirect('back');
                });
            }
        });
    });
});

router.get('/:article/edit', middleware.isLoggedIn, (req, res) => {
    Repeater.find({}, (err, foundRepeaters) => {
        Article.findById(req.params.article, (err, foundArticle) => {
            if(err){console.log(err); res.redirect('back')}
            res.render('history/edit', {
                repeaters: foundRepeaters,
                article: foundArticle
            });
        });
    });
});

router.put('/:article/edit', middleware.isLoggedIn, (req, res) => {
    Repeater.find({}, (err, foundRepeaters) => {
        if(err){
            console.log(err); 
            res.redirect('back');
        } else if(!req.files) {
            const updatedArticle = {
                name: req.body.name,
                text: req.body.text,
            }
            Article.findByIdAndUpdate(req.params.article, updatedArticle, (err, foundArticle) => {
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
            var movedImage = '/uploads/' + now + newImage.name;
            const updatedArticle = {
                name: req.body.name,
                text: req.body.text,
                image: movedImage
            }
            Article.findByIdAndUpdate(req.params.article, updatedArticle, (err, foundArticle) => {
                if(err){console.log(err); res.redirect('back')}
                res.redirect('back');
            });
        }
    });
});


module.exports = router;
