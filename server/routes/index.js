var express = require('express');
var router = express.Router();

const path = require('path');


// db test
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})
router.get('/db2', async (req, res) => {
  res.send('test');
})

router.get('/db', async (req, res) => {
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
// router.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });


module.exports = router;
