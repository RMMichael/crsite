var createError = require('http-errors');
var express = require('express');
var path = require('path');
var debug = require('debug')('crsite:server');


var app = express();
// serve static files

var session = require('express-session');
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'keyboard cat'
}));

app.get('/login', function(req, res){
  var body = '';
  if (req.session.views) {
    ++req.session.views;
  } else {
    req.session.views = 1;
    body += '<p>First time visiting? view this page in several browsers :)</p>';
  }
  res.send(body + '<p>viewed <strong>' + req.session.views + '</strong> times.</p>');
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// db test
const { Pool } = require('pg');
var parse = require('pg-connection-string').parse;
var config = parse(process.env.DATABASE_URL);
console.log(config);
console.log(process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
  // ssl : process.env.DEBUG ? false : true
})

app.get('/db2', async (req, res) => {
  req.session.blah += 1;
  res.send('test' + req.session.blah);
})

app.get('/db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM test_table');
    const results = { 'results': (result) ? result.rows : null };
    res.send(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get('/api/user', function (req, res) {
  res.json({
    status: 'ok',
    user: req.session.user
  });
});

// TODO - currently just logs in the first user in the user table
app.post('/api/user/login', async (req, res) => {
  debug(req.body);  // the received json
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users LIMIT 1');
    const user = result ? result.rows[0] : null;
    if (user) {
      req.session.user = user;
      res.json({
        status: 'ok',
        user
      });
      return;
    }
  } catch (err) {
    console.error(err);
  }
  res.json({status: 'error'});
});

app.post('/api/user/logout', (req, res) => {
  req.session.destroy();
  res.json({
    status: 'ok'
  });
});

app.get('/api/review_table', async (req, res) => {
  let text = `
    SELECT c.dept, c.number, c.title, t.instructor, t.difficulty, t.hours_per_week, t.rating, t.review_count
    FROM (
        SELECT course_id, instructor, AVG(difficulty) as difficulty,
               AVG(hours_per_week) as hours_per_week, AVG(rating) as rating, COUNT(*) as review_count
        FROM classes JOIN reviews ON classes.course_code = reviews.course_code
        GROUP BY classes.course_code
      ) t JOIN courses c ON t.course_id = c.id
  `;
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err.message + ' : ' + err.status || 500 );
});

module.exports = app;
