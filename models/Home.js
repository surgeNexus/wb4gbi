var mongoose = require('mongoose');

var HomeSchema = new mongoose.Schema({
  name: String,
  text: String,
  image: String
});

module.exports = mongoose.model('Home', HomeSchema);
