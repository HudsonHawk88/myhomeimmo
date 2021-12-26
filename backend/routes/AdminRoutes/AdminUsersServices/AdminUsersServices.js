const { jwtparams, useQuery, poolConnect, validateToken, hasRole } = require('../../../common/QueryHelpers');
const router = require("express").Router();
const adminusers = poolConnect();
const bcrypt = require("bcrypt");

// ADMINUSERS START

router.get("/", async (req, res) => {
  const token = req.cookies.JWT_TOKEN;
  if (token) {
    const id = req.headers.id;
    const user = validateToken(token, jwtparams.secret);
    // const user = { roles: [{ value: "SZUPER_ADMIN"}]}
    if (user === null) {
      res.status(401).send({
        err: "Nincs belépve! Kérem jelentkezzen be!"
      });
    } else {
      if (id) {
        const sql = `SELECT * FROM adminusers WHERE id='${id}';`;
        adminusers.query(sql, (err, result) => {
          if (!err) {
            if ((result[0].email === user.email) || user.roles && hasRole(JSON.parse(user.roles), ["SZUPER_ADMIN"])) {
              const resss = result[0];
              resss.cim = JSON.parse(resss.cim);
              resss.nev = JSON.parse(resss.nev);
              resss.roles = JSON.parse(resss.roles);
              resss.telefon = JSON.parse(resss.telefon);
              resss.avatar = JSON.parse(resss.avatar);
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
        const sql = `SELECT * FROM adminusers;`;
        adminusers.query(sql, (error, ress) => {
          if (error) {
            res.status(500).send({ err: 'Hiba történt a felhasználók lekérdezésekor!' });
          } else {
            let resss = ress;
            resss.map((item) => {
              item.cim = JSON.parse(item.cim);
              item.nev = JSON.parse(item.nev);
              item.roles = JSON.parse(item.roles);
              item.telefon = JSON.parse(item.telefon);
            });
            res.status(200).send(resss);
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
    const user = validateToken(token, jwtparams.secret);
    // const user = { roles: [{ value: "SZUPER_ADMIN"}] };
    if (user === null) {
      res.status(401).send({
        err: "Nincs belépve! Kérem jelentkezzen be!"
      });
    } else {
      if (
        user.roles &&
        user.roles.length !== 0 &&
        hasRole(user.roles, ["SZUPER_ADMIN"])
      ) {
        let felvitelObj = req.body;
        if (felvitelObj) {
          felvitelObj = JSON.parse(JSON.stringify(felvitelObj));
          const hash = await bcrypt.hash(felvitelObj.password, 10);
          //store user, password and role
          const sql = `CREATE TABLE IF NOT EXISTS eobgycvo_myhome.adminusers (
                    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    nev json DEFAULT NULL,
                    cim json DEFAULT NULL,
                    telefon json DEFAULT NULL,
                    avatar json DEFAULT NULL,
                    username text DEFAULT NULL,
                    email text DEFAULT NULL,
                    password char(100) DEFAULT NULL,
                    token text(200) DEFAULT NULL,
                    roles json
                  ) ENGINE=InnoDB;`;
          adminusers.query(sql, async (error) => {
            if (!error) {
              const sqlEmail =
                `SELECT email FROM adminusers WHERE email = '${felvitelObj.email}';`;
              const resultEmail = await useQuery(adminusers, sqlEmail);
              // if (resultEmail.rowCount === 0) {
              if (resultEmail.length === 0) {
                const sql = `INSERT INTO adminusers (nev, cim, telefon, avatar, username, email, password, roles, token)
                          VALUES ('${JSON.stringify(felvitelObj.nev)}', '${JSON.stringify(felvitelObj.cim)}', '${JSON.stringify(felvitelObj.telefon)}', '${JSON.stringify(felvitelObj.avatar)}', '${felvitelObj.username}', '${felvitelObj.email}', '${hash}', '${JSON.stringify(felvitelObj.roles)}', '${null}');`;
                adminusers.query(sql, (err) => {
                  if (!err) {
                    res.status(200).send({
                      msg: 'Admin sikeresen hozzáadva!'
                    });
                  } else {
                    res.status(500).send({
                      err: err
                    });
                  }
                });
              } else {
                res.status(400).send({
                  err: "Ezzel a felhasználónévvel / email címmel már regisztráltak!",
                });
              }
            } else {
              res.status(500).send({
                err: error,
                msg: "Hiba történt az adatbázis létrehozásakor! Értesítse a weboldal rendszergazdáját!",
              });
            }
          });
        } else {
          res
            .status(400)
            .send({
              err: "Felhasználó adatainak megadása kötelező"
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
    const user = validateToken(token, jwtparams.secret);
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
        if (
          user.email === modositoObj.email ||
          (user.roles &&
            hasRole(JSON.parse(user.roles), ["SZUPER_ADMIN"]))
        ) {
          if (id) {
            modositoObj = JSON.parse(JSON.stringify(modositoObj));
            const hash = await bcrypt.hash(modositoObj.password, 10);
            const sql = `UPDATE adminusers SET nev = '${JSON.stringify(modositoObj.nev)}', cim = '${JSON.stringify(modositoObj.cim)}', telefon = '${JSON.stringify(modositoObj.telefon)}', avatar = '${JSON.stringify(modositoObj.avatar)}', username = '${modositoObj.username}', email = '${modositoObj.email}', password = '${hash}', roles = '${JSON.stringify(modositoObj.roles)}' WHERE id = '${id}';`;
            adminusers.query(sql, (err) => {
              if (!err) {
                res
                  .status(200)
                  .send({
                    msg: "Felhasználó sikeresen módosítva!"
                  });
              } else {
                res
                  .status(500)
                  .send({
                    err: "Felhasználó módosítása sikertelen!",
                    msg: err
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
              err: "Felhasználó adatainak megadása kötelező"
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

router.delete("/", (req, res) => {
  const token = req.cookies.JWT_TOKEN;
  if (token) {
    const user = validateToken(token, jwtparams.secret);
    if (user === null) {
      res.status(401).send({
        err: "Nincs belépve! Kérem jelentkezzen be!"
      });
    } else {
      if (
        user.roles &&
        hasRole(JSON.parse(user.roles), ["SZUPER_ADMIN"])
      ) {
        if (id) {
          const sql = `DELETE FROM adminusers WHERE id='${id}';`;
          adminusers.query(sql, (err) => {
            if (!err) {
              res.status(200).send({
                msg: "Felhasználó sikeresen törölve!"
              });
            } else {
              res.status(500).send({
                err: "Felhasználó törlése sikertelen!"
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

// ADMINUSERS END

module.exports = router;