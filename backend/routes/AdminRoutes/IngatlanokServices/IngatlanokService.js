const { jwtparams, poolConnect, validateToken, createIngatlanokSql, createIngatlanokTriggerSql, hasRole } = require('../../../common/QueryHelpers');
const router = require("express").Router();
const ingatlanok = poolConnect();


// INGATLANOK START

router.get("/", (req, res) => {
  const token = req.cookies.JWT_TOKEN;
  if (token) {
    const id = req.headers.id;
    const user = validateToken(token, jwtparams.secret);
    if (user === null) {
      res.status(401).send({ err: "Nincs belépve! Kérem jelentkezzen be!" });
    } else {
      if (id) {
        const sql = `SELECT * FROM ingatlanok WHERE id='${id}';`;
        ingatlanok.query(sql, async (err, result) => {
          if (!err) {
            let ressss = result;
            await ressss.map((ing) => {
              if (ing.kepek) {
                ing.kepek = JSON.parse(ing.kepek);
              }
              if (ing.rogzitoAvatar) {
                ing.rogzitoAvatar = JSON.parse(ing.rogzitoAvatar);
              }
              ing.helyseg = JSON.parse(ing.helyseg);
              ing.isHirdetheto = ing.isHirdetheto === 0 ? true : false;
              ing.isKiemelt = ing.isKiemelt === 0 ? true : false;
              ing.isErkely = ing.isErkely === 0 ? true : false;
              ing.isLift = ing.isLift === 0 ? true : false;
              ing.isAktiv = ing.isAktiv === 0 ? true : false
              ing.isUjEpitesu = ing.isUjEpitesu === 0 ? true : false
            })
            res.status(200).send(ressss);
          } else {
            res.status(500).send({ err: err});
          }
        });
      } else {
        res.status(400).send({ err: "Id megadása kötelező!" });
      }
    }
  } else {
    res.status(401).send({ err: "Nincs belépve! Kérem jelentkezzen be!" });
  }
});

router.post("/", async (req, res) => {
  const token = req.cookies.JWT_TOKEN;
  if (token) {
    const user = validateToken(token, jwtparams.secret);

    // const user = { roles: [{ value: "SZUPER_ADMIN"}] };
    if (user === null) {
      res.status(401).send({ err: "Nincs belépve! Kérem jelentkezzen be!" });
    } else {
      let felvitelObj = req.body;
      if (felvitelObj) {
        felvitelObj = JSON.parse(JSON.stringify(felvitelObj));
        const sql = createIngatlanokSql;
        const createTriggerSql = createIngatlanokTriggerSql;
        ingatlanok.query(sql, (errr) => {
          if (errr) {
            res.status(500).send({ err: errr })
          } else {
            felvitelObj.isKiemelt = felvitelObj.isKiemelt === true ? 0 : 1
            felvitelObj.isHirdetheto = felvitelObj.isHirdetheto === true ? 0 : 1
            felvitelObj.isErkely = felvitelObj.isErkely === true ? 0 : 1
            felvitelObj.isLift = felvitelObj.isLift === true ? 0 : 1
            felvitelObj.isAktiv = felvitelObj.isAktiv === true ? 0 : 1
            felvitelObj.isUjEpitesu = felvitelObj.isUjEpitesu === true ? 0 : 1
            ingatlanok.query(createTriggerSql, async (error) => {
              if (!error) {
                const sql = `INSERT INTO ingatlanok(cim, leiras, helyseg, irsz, telepules, kepek, ar, kaucio, statusz, tipus, allapot, emelet, alapterulet, telek, telektipus, beepithetoseg, viz, gaz, villany, szennyviz, szobaszam, felszobaszam, epitesmod, futes, isHirdetheto, isKiemelt, isErkely, isLift, isAktiv, isUjEpitesu, rogzitoNev, rogzitoEmail, rogzitoTelefon, rogzitoAvatar) VALUES ('${felvitelObj.cim}', '${felvitelObj.leiras}', '${JSON.stringify(felvitelObj.helyseg)}', '${felvitelObj.helyseg.irszam}', '${felvitelObj.telepules}', '${JSON.stringify(felvitelObj.kepek)}', '${felvitelObj.ar}', '${felvitelObj.kaucio}', '${felvitelObj.statusz}', '${felvitelObj.tipus}', '${felvitelObj.allapot}', '${felvitelObj.emelet}', '${felvitelObj.alapterulet}', '${felvitelObj.telek}', '${felvitelObj.telektipus}', '${felvitelObj.beepithetoseg}', '${felvitelObj.viz}', '${felvitelObj.gaz}', '${felvitelObj.villany}', '${felvitelObj.szennyviz}', '${felvitelObj.szobaszam}', '${felvitelObj.felszobaszam}', '${felvitelObj.epitesmod}', '${felvitelObj.futes}', '${felvitelObj.isHirdetheto}', '${felvitelObj.isKiemelt}', '${felvitelObj.isErkely}', '${felvitelObj.isLift}', '${felvitelObj.isAktiv}', '${felvitelObj.isUjEpitesu}', '${felvitelObj.feladoNev}', '${felvitelObj.feladoEmail}', '${felvitelObj.feladoTelefon}', '${JSON.stringify(felvitelObj.avatar)}');`;
                ingatlanok.query(
                  sql,
                  (err) => {
                    if (!err) {
                      res
                        .status(200)
                        .send({ msg: "Ingatlan sikeresen hozzáadva!" });
                    } else {
                      res
                        .status(500)
                        .send({ err: "Ingatlan hozzáadása sikertelen!", msg: err });
                    }
                  }
                );
              } else {
                res.status(500).send({
                  err: error,
                  msg: "Hiba történt az adatbázis létrehozásakor! Értesítse a weboldal rendszergazdáját!",
                });
              }
            });
          }
        });
      } else {
        res.status(400).send({ err: "Ingatlan adatainak megadása kötelező" });
      }
    }
  } else {
    res.status(401).send({ err: "Nincs belépve! Kérem jelentkezzen be!" });
  }
});

router.put("/", (req, res) => {
  const token = req.cookies.JWT_TOKEN;
  if (token) {
    const user = validateToken(token, jwtparams.secret);
    if (user === null) {
      res.status(401).send({ err: "Nincs belépve! Kérem jelentkezzen be!" });
    } else {
      let modositoObj = req.body;
      const id = req.headers.id;
      if (modositoObj) {
        if (id) {
          modositoObj = JSON.parse(JSON.stringify(modositoObj));
          modositoObj.isKiemelt = modositoObj.isKiemelt === true ? 0 : 1
          modositoObj.isHirdetheto = modositoObj.isHirdetheto === true ? 0 : 1
          modositoObj.isErkely = modositoObj.isErkely === true ? 0 : 1
          modositoObj.isLift = modositoObj.isLift === true ? 0 : 1
          modositoObj.isAktiv = modositoObj.isAktiv === true ? 0 : 1
          modositoObj.isUjEpitesu = modositoObj.isUjEpitesu === true ? 0 : 1
          const sql = `UPDATE ingatlanok SET cim='${modositoObj.cim}', leiras='${modositoObj.leiras}', helyseg='${JSON.stringify(modositoObj.helyseg)}', kepek='${JSON.stringify(modositoObj.kepek)}', irsz='${modositoObj.irsz}', telepules='${modositoObj.telepules}', ar='${modositoObj.ar}', kaucio='${modositoObj.kaucio}', statusz='${modositoObj.statusz}', tipus='${modositoObj.tipus}', allapot='${modositoObj.allapot}', emelet='${modositoObj.emelet}', alapterulet='${modositoObj.alapterulet}', telek='${modositoObj.telek}', telektipus='${modositoObj.telektipus}', beepithetoseg='${modositoObj.beepithetoseg}', viz='${modositoObj.viz}', gaz='${modositoObj.gaz}', villany='${modositoObj.villany}', szennyviz='${modositoObj.szennyviz}', szobaszam='${modositoObj.szobaszam}', felszobaszam='${modositoObj.felszobaszam}', epitesmod='${modositoObj.epitesmod}', futes='${modositoObj.futes}', isHirdetheto='${modositoObj.isHirdetheto}', isKiemelt='${modositoObj.isKiemelt}', isErkely='${modositoObj.isErkely}', isLift='${modositoObj.isLift}', isAktiv='${modositoObj.isAktiv}', isUjEpitesu='${modositoObj.isUjEpitesu}', rogzitoNev='${modositoObj.feladoNev}', rogzitoEmail='${modositoObj.feladoEmail}', rogzitoTelefon='${modositoObj.feladoTelefon}', rogzitoAvatar='${JSON.stringify(modositoObj.feladoAvatar)}' WHERE id='${id}';`;
          ingatlanok.query(sql, (err) => {
            if (!err) {
              res.status(200).send({ msg: "Ingatlan sikeresen módosítva!" });
            } else {
              res.status(500).send({ err: "Ingatlan módosítása sikertelen!",  msg: err });
            }
          });
        } else {
          res.status(400).send({ err: "Id megadása kötelező" });
        }
      } else {
        res.status(400).send({ err: "Ingatlan adatainak megadása kötelező" });
      }
    }
  } else {
    res.status(401).send({ err: "Nincs belépve! Kérem jelentkezzen be!" });
  }
});

router.delete("/", async (req, res) => {
  const token = req.cookies.JWT_TOKEN;
  if (token) {
    const user = validateToken(token, jwtparams.secret);
    if (user === null) {
      res.status(401).send({ err: "Nincs belépve! Kérem jelentkezzen be!" });
    } else {
      // TODO hozzáadni a feltöltő regisztrált usert is a jogosultakhoz!!!
        const id = req.headers.id;
        if (id) {
            // let userEmail = undefined;
            // const selectSql = `SELECT email FROM ingatlanok WHERE id='${id}';`;
            // ingatlanok.query(selectSql, (err, result) => {
            //     if (!err) {
            //         userEmail = result.rows[0].email;
            //     }
            // });
            if (user.roles &&
                hasRole(JSON.parse(user.roles), ["SZUPER_ADMIN"]) ) {
                    const sql = `DELETE FROM ingatlanok WHERE id='${id}';`;
                    // const sql = `DELETE FROM ingatlanok WHERE id='${id}' AND email='${user.email}';`;
                    ingatlanok.query(sql, (err) => {
                      if (!err) {
                        res.status(200).send({ msg: "Ingatlan sikeresen törölve!" });
                      } else {
                        res.status(500).send({ err: "Ingatlan törlése sikertelen!" });
                      }
                    });
                } else {
                    res
                    .status(403)
                    .send({ err: "Nincs jogosultsága az adott művelethez!" });
                }
        
        } else {
          res.status(400).send({ err: "Id megadása kötelező" });
        }
    }
  } else {
    res.status(401).send({ err: "Nincs belépve! Kérem jelentkezzen be!" });
  }
});

// INGATLANOK END

module.exports = router;
