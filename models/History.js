var mongoose = require('mongoose');

var HistorySchema = new mongoose.Schema({
  frequency: String,
  repeaterId: String,
  articles: [
      {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
    }
  ]
});

module.exports = mongoose.model('History', HistorySchema);
