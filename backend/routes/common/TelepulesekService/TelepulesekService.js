const { poolConnect } = require('../../../common/QueryHelpers');
const router = require('express').Router();
const telepulesek = poolConnect();


// TELEPULESEK START

router.get('/', (req, res) => {
  const id = req.headers.id;
  const like = req.headers.like;
  const irszam = req.headers.irsz;
  if (id) {
    const sql = `SELECT * FROM telep_1 WHERE id='${id}';`;
    telepulesek.query(sql, (err, result) => {
        if (!err) {
          res.status(200).send(result);
        } else {
          res.status(500).send({ err: err });
        }
      }
    );
  } else if (irszam) {
    const sql = `SELECT * FROM telep_1 WHERE irszam='${irszam}';`;
    telepulesek.query(sql, (err, result) => {
        if (!err) {
          res.status(200).send(result);
        } else {
          res.status(500).send({ err: err });
        }
      }
    );
  } else if (like) {
    const sql = `SELECT * FROM telep_1 WHERE telepulesnev LIKE '${like}';`;
    telepulesek.query(sql, (err, result) => {
        if (!err) {
          res.status(200).send(result);
        } else {
          res.status(500).send({ err: err });
        }
      }
    );
  } else {
    const sql = `SELECT id, geoLat, geoLong, irszam, telepulesnev, megye, megyekod FROM telep_1 GROUP BY telepulesnev;`;
    telepulesek.query(sql, (err, result) => {
      if (!err) {
        res.status(200).send(result);
      } else {
        res.status(500).send({ err: err });
      }
    });
  }
})

// TELEPULESEK END

module.exports = router;
