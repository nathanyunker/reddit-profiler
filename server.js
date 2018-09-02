let express = require('express');
let app = express();
let port = process.env.PORT || 3000;
var bodyParser = require('body-parser');

console.log('CURRENT ENVIRONMENT IS------', app.settings.env);

app.use(function (req, res, next) {
  if (app.settings.env === "production") {
    console.log('APP settings are production, allowign that origin');
    res.setHeader('Access-Control-Allow-Origin', 'https://secret-wave-23471.herokuapp.com');
  } else {
    console.log('APP settings are not production, allowign that localhost');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let redditRoutes = require('./api/routes/redditRoutes');
redditRoutes(app);

app.get('/', function (req, res) {
  res.send('hello world')
})

let server = app.listen(port);

console.log('Server listening on port: ' + port);

module.exports = server;