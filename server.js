require("dotenv").config();
const express = require("express");
const dns = require("dns");
const validUrl = require('valid-url')
const cors = require("cors");
const { urlencoded } = require("body-parser");

const Url = require("./db");
const { findOneAndUpdate } = require("./db");

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(urlencoded({ extended: false }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", (req, res, next) => {
  const originalUrl = req.body.url;
  if (!validUrl.isUri(originalUrl)) {
    res.json({"error":"invalid url"})
    return
  }
  let shortNumber = 1;
  Url.findOne({})
    .sort({ short_url: "desc" })
    .exec((err, result) => {
      if (!err && result != undefined) {
        shortNumber = result.short_url + 1;
      }
      if (!err) {
        Url.findOneAndUpdate(
          { original_url: originalUrl },
          { original_url: originalUrl, short_url: shortNumber },
          { new: true, upsert: true },
          (err, savedUrl) => {
            if (!err) {
              res.json({original_url: savedUrl.original_url, short_url: savedUrl.short_url})
            }
          }
        );
      }
    }); 
});

app.get('/api/shorturl/:short', (req, res, next) => {
  const short = req.params.short

  Url.findOne({short_url: short}, (err, data) => {
    if (!err && data != undefined) {
      res.redirect(data.original_url)
    }
    else {
      res.json({error:'Wrong format'})
    }
  })
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
