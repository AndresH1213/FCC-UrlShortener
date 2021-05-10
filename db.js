require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Schema = mongoose.Schema;

const UrlSchema = new Schema({
  original_url: {
    type: String,
    required: true
  },
  short_url: Number
});

module.exports = mongoose.model("Url", UrlSchema);
