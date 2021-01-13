var mongoose = require('mongoose');

var RepeaterSchema = new mongoose.Schema({
  frequency: String,
  tone: String,
  location: String,
  image: String,
  statusText: String,
  status: { type: Boolean, default: false },
  articles: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }
],
  history: String,
});

module.exports = mongoose.model('Repeater', RepeaterSchema);
