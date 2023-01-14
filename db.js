const mongoose = require("mongoose");
const mongoURI = process.env['MONGO_URI']

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//mongoose.set('strict Query', true)

const URLSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: String,
    required: true,
  },
});

const URLS = mongoose.model("URLS", URLSchema);

module.exports = URLS;