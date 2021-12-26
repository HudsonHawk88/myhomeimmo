const router = require('express').Router();
const { poolConnect } = require('../../../common/QueryHelpers');
const kapcsolat = poolConnect();

// KAPCSOLAT START

router.get('/', (req, res) => {
  
  const sql = `SELECT * FROM kapcsolat;`;
  kapcsolat.query(sql, (err, result) => {
    if (!err) {
        let ress = result;
        ress.forEach((item) => {
          item.kep = JSON.parse(item.kep);
        })
        res.status(200).send(ress);
    } else {
      res.status(500).send({ err: err });
    }
  });
});

// KAPCSOLAT END

module.exports = router;