const router = require('express').Router();
const { poolConnect } = require('../../../common/QueryHelpers');
const penzugyiSzolg = poolConnect();

// PENZUGYISZOLGALTATASOK START

router.get('/', (req, res) => {
  
  const sql = `SELECT * FROM penzugyi_szolg;`;
  penzugyiSzolg.query(sql, (err, result) => {
    if (!err) {
      let ress = result[0];
      ress.kep = JSON.parse(ress.kep);
      res.status(200).send(ress);
    } else {
      res.status(500).send({ err: err });
    }
  });
});

// PENZUGYISZOLGALTATASOK END

module.exports = router;