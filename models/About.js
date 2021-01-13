var mongoose = require('mongoose');

var AboutSchema = new mongoose.Schema({
  title: String,
  text: String,
  image: String,
  image2: String,
  image3: String
});

module.exports = mongoose.model('About', AboutSchema);
