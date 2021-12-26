const router = require('express').Router();
const { poolConnect } = require('../../../common/QueryHelpers');
const myArt = poolConnect();

// MYART START

router.get('/altalanos', (req, res) => {
  
  const sql = `SELECT * FROM myart_altalanos;`;
  myArt.query(sql, (err, result) => {
    if (!err) {
        res.status(200).send(result);
    } else {
      res.status(500).send({ err: err });
    }
  });
});

router.get('/galeriak', (req, res) => {
    const sql = `SELECT * FROM myart_galeriak WHERE isActive='0';`;
    myArt.query(sql, (err, result) => {
      if (!err) {
          let ress = result;
          res.forEach((item) => {
              item.kepek = JSON.parse(item.kepek);
              item.isActive = item.isActive === '0' ? true : false
          });
          res.status(200).send(ress);
      } else {
        res.status(500).send({ err: err });
      }
    });
});

// MYART END

module.exports = router;