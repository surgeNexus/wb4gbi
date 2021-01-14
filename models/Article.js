var mongoose = require('mongoose');

var ArticleSchema = new mongoose.Schema({
  name: String,
  text: String,
  image: String,
  repeaterFreq: String,
});

module.exports = mongoose.model('Article', ArticleSchema);
