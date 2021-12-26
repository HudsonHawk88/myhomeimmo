const router = require('express').Router();
const { poolConnect } = require('../../../common/QueryHelpers');
const GDPR = poolConnect();

// GDPR START

router.get('/', (req, res) => {
  
  const sql = `SELECT * FROM gdpr;`;
  GDPR.query(sql, (err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      res.status(500).send({ err: err });
    }
  });
});

// GDPR END

module.exports = router;