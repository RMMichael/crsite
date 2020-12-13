var createError = require('http-errors');
var express = require('express');
var path = require('path');


var app = express();
// serve static files

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
  res.send('test');
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
