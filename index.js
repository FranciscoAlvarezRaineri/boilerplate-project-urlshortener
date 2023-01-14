require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const URLS = require("./db.js")
const morgan = require("morgan");
const dns = require('dns');
const isUrlHttp = require('is-url-http');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
//app.use(express.json())

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(morgan("tiny"));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl", bodyParser.urlencoded({ extended: false }), (req, res, next) => {
  const original_url = req.body.url
   if (isUrlHttp(original_url)) {
    const short_url = hashCode(original_url)
    const newURL = new URLS({ original_url, short_url})
    newURL.save((err, data)=>{
      res.json({ original_url, short_url})
    })
   } else {
     res.json({ error: 'invalid url' })
   }
})

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

function hashCode(s) {
    for(var i = 0, h = 0; i < s.length; i++)
        h = Math.imul(5, h) + s.charCodeAt(i) | 0;
    return Math.abs(h).toString();
}

app.get("/api/shorturl/:short_url", (req, res, next)=>{
  const short_url = req.params.short_url
  URLS.findOne({short_url}, (err, data)=>{
  res.redirect(data.original_url)
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
