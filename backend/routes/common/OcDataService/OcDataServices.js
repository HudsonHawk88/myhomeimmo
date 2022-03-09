const { poolConnect } = require('../../../common/QueryHelpers');
const router = require('express').Router();
const ocData = poolConnect();


// OCDATA START

router.get('/getOcImage', (req, res) => {
  const id = req.query.id;
    console.log(req.query.id);

    const sql = `SELECT kepek FROM ingatlanok WHERE id='${id}';`;
    ocData.query(sql, (err, result) => {
        if (!err) {
            const rrr = result[0];
            const kepek = JSON.parse(rrr.kepek);
            const primaryImage = kepek[0].src;
            res.writeHead(200, { 'Content-Type': 'image/png' }).end(primaryImage)
        //   res.status(200).send(primaryImage);
        } else {
          res.status(500).send({ err: err });
        }
      }
    );

})

router.get('/getOcTitle', (req, res) => {
    const id = req.query.id;
  
  
      const sql = `SELECT cim FROM ingatlanok WHERE id='${id}';`;
      ocData.query(sql, (err, result) => {
          if (!err) {
            const rrr = result[0];
            const cim = rrr.cim;
            res.status(200).send(cim);
          } else {
            res.status(500).send({ err: err });
          }
        }
      );
  
  })

// OCDATA END

module.exports = router;
