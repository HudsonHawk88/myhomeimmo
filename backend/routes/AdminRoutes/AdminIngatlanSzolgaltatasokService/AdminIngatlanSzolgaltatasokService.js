const { jwtparams, useQuery, poolConnect, validateToken, hasRole } = require('../../../common/QueryHelpers');
const router = require("express").Router();
const ingatlanSzolg = poolConnect();

// ROLES START

router.get("/", async (req, res) => {
  const token = req.cookies.JWT_TOKEN;
  if (token) {
    const id = req.headers.id;
    const user = await validateToken(token, jwtparams.secret);
    // const user = { roles: [{ value: "SZUPER_ADMIN"}]}
    if (user === null) {
      res.status(401).send({
        err: "Nincs belépve! Kérem jelentkezzen be!"
      });
    } else {
      if (id) {
        const sql = `SELECT * FROM ingatlan_szolg WHERE id='${id}';`;
        ingatlanSzolg.query(sql, (err, result) => {
          if (!err) {
            if (hasRole(JSON.parse(user.roles), ["SZUPER_ADMIN"])) {
              let resss = result[0];
              resss.kep = JSON.parse(resss.kep);
              res.status(200).send(resss);
            } else {
              res
              .status(403)
              .send({
                err: "Nincs jogosultsága az adott művelethez!"
            });
          }
        }});
      } else {
        const sql = `SELECT * FROM ingatlan_szolg;`;
        ingatlanSzolg.query(sql, (error, ress) => {
          if (error) {
            res.status(500).send({ err: 'Hiba történt a szolgaltatasok lekérdezésekor!' });
          } else {
            let result = ress;
            result.map((item) => {
              item.kep = JSON.parse(item.kep);
            })
            res.status(200).send(result);
          }
        })
      }
    }
  } else {
    res.status(401).send({
      err: "Nincs belépve! Kérem jelentkezzen be!"
    });
  }
});

router.post("/", async (req, res) => {
  const token = req.cookies.JWT_TOKEN;
  // TODO berakni a token vizsgálatot a true helyére és a user a validateToken-es lesz ha lesz Admin felület hozzá!!!
  if (token) {
    const user = await validateToken(token, jwtparams.secret);
    // const user = { roles: [{ value: "SZUPER_ADMIN"}] };
    if (user === null) {
      res.status(401).send({
        err: "Nincs belépve! Kérem jelentkezzen be!"
      });
    } else {
      if (
        user.roles &&
        user.roles.length !== 0 &&
        hasRole(JSON.parse(user.roles), ["SZUPER_ADMIN"])
      ) {
        let felvitelObj = req.body;
        if (felvitelObj) {
          felvitelObj = JSON.parse(JSON.stringify(felvitelObj));
          //store user, password and role
          const sql = `CREATE TABLE IF NOT EXISTS eobgycvo_myhome.ingatlan_szolg (
                    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    azonosito text DEFAULT NULL,
                    kep json DEFAULT NULL,
                    leiras text DEFAULT NULL
                  ) ENGINE=InnoDB;`;
          ingatlanSzolg.query(sql, async (error) => {
            if (!error) {
              const ingSzolgSql =
                `SELECT azonosito FROM ingatlan_szolg WHERE azonosito = '${felvitelObj.azonosito}';`;
              const result = await useQuery(ingatlanSzolg, ingSzolgSql);
              // if (resultEmail.rowCount === 0) {
              if (result.length === 0) {
                const sql = `INSERT INTO ingatlan_szolg (azonosito, kep, leiras)
                          VALUES ('${felvitelObj.azonosito}', '${JSON.stringify(felvitelObj.kep)}', '${felvitelObj.leiras}');`;
                ingatlanSzolg.query(sql, (err) => {
                  if (!err) {
                    res.status(200).send({
                      msg: 'Szolgáltatás sikeresen hozzáadva!'
                    });
                  } else {
                    res.status(500).send({
                      err: err
                    });
                  }
                });
              } else {
                res.status(400).send({
                  err: "Ez a szolgáltatás már létezik!",
                });
              }
            } else {
              res.status(500).send({
                err: 'Hiba történt az adatbázis létrehozásakor! Értesítse a weboldal rendszergazdáját!',
                msg: err,
              });
            }
          });
        } else {
          res
            .status(400)
            .send({
              err: "Szolgáltatás adatainak megadása kötelező!"
            });
        }
      } else {
        res
          .status(403)
          .send({
            err: "Nincs jogosultsága az adott művelethez!"
          });
      }
    }
  } else {
    res.status(401).send({
      err: "Nincs belépve! Kérem jelentkezzen be!"
    });
  }
});

router.put("/", async (req, res) => {
  const token = req.cookies.JWT_TOKEN;
  if (token) {
    const user = await validateToken(token, jwtparams.secret);
    // const user = { roles: [{ value: "SZUPER_ADMIN"}] };
    if (user === null) {
      res.status(401).send({
        err: "Nincs belépve! Kérem jelentkezzen be!"
      });
    } else {
      const id = req.headers.id;
      let modositoObj = req.body;
      if (modositoObj) {
        // TODO Email címet most csak szuperadmin tud módoítani!!!!
        if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ["SZUPER_ADMIN"])) {
          if (id) {
            modositoObj = JSON.parse(JSON.stringify(modositoObj));
            const sql = `UPDATE ingatlan_szolg SET azonosito='${modositoObj.azonosito}', kep='${JSON.stringify(modositoObj.kep)}', leiras='${modositoObj.leiras}' WHERE id = '${id}';`;
            ingatlanSzolg.query(sql, (err) => {
              if (!err) {
                res
                  .status(200)
                  .send({
                    msg: "Szolgáltatás sikeresen módosítva!"
                  });
              } else {
                res
                  .status(500)
                  .send({
                    err: "Szolgáltatás módosítása sikertelen!"
                  });
              }
            });
          } else {
            res.status(400).send({
              err: "Id megadása kötelező"
            });
          }
        } else {
          res
            .status(400)
            .send({
              err: "Szolgáltatás adatainak megadása kötelező"
            });
        }
      } else {
        res
          .status(403)
          .send({
            err: "Nincs jogosultsága az adott művelethez!"
          });
      }
    }
  } else {
    res.status(401).send({
      err: "Nincs belépve! Kérem jelentkezzen be!"
    });
  }
});

router.delete("/", async (req, res) => {
  const token = req.cookies.JWT_TOKEN;
  const id = req.headers.id;
  if (token) {
    const user = await validateToken(token, jwtparams.secret);
    if (user === null) {
      res.status(401).send({
        err: "Nincs belépve! Kérem jelentkezzen be!"
      });
    } else {
      if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
        if (id) {
          const sql = `DELETE FROM ingatlan_szolg WHERE id='${id}';`;
          ingatlanSzolg.query(sql, (err) => {
            if (!err) {
              res.status(200).send({
                msg: "Szolgáltatás sikeresen törölve!"
              });
            } else {
              res.status(500).send({
                err: "Szolgáltatás törlése sikertelen!"
              });
            }
          });
        } else {
          res.status(400).send({
            err: "Id megadása kötelező"
          });
        }
      } else {
        res
          .status(403)
          .send({
            err: "Nincs jogosultsága az adott művelethez!"
          });
      }
    }
  } else {
    res.status(401).send({
      err: "Nincs belépve! Kérem jelentkezzen be!"
    });
  }
});

// ROLES END

module.exports = router;