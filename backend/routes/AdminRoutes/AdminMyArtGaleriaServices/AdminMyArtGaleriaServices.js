const { jwtparams, useQuery, poolConnect, validateToken, hasRole } = require('../../../common/QueryHelpers');
const router = require("express").Router();
const myArt = poolConnect();

// MYARTALTALANOS START

router.get("/altalanos", async (req, res) => {
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
        const sql = `SELECT * FROM myart_altalanos WHERE id='${id}';`;
        myArt.query(sql, (err, result) => {
          if (!err) {
            if (hasRole(JSON.parse(user.roles), ["SZUPER_ADMIN"])) {
              let resss = result[0];
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
        const sql = `SELECT * FROM myart_altalanos;`;
        myArt.query(sql, (error, ress) => {
          if (error) {
            res.status(500).send({ err: 'Hiba történt a MyArt Általános bejegyzés lekérdezésekor!' });
          } else {
            res.status(200).send(ress);
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

router.post("/altalanos", async (req, res) => {
  const token = req.cookies.JWT_TOKEN;
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
        hasRole(JSON.parse(user.roles), ["SZUPER_ADMIN"])
      ) {
        let felvitelObj = req.body;
        if (felvitelObj) {
          felvitelObj = JSON.parse(JSON.stringify(felvitelObj));
          //store user, password and role
          const sql = `CREATE TABLE IF NOT EXISTS eobgycvo_myhome.myart_altalanos (
                    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    azonosito text DEFAULT NULL,
                    nev text DEFAULT NULL,
                    leiras text DEFAULT NULL
                  ) ENGINE=InnoDB;`;
          myArt.query(sql, async (error) => {
            if (!error) {
              const myArtAltalanosSql =
                `SELECT azonosito FROM myart_altalanos WHERE azonosito = '${felvitelObj.azonosito}';`;
              const result= await useQuery(myArt, myArtAltalanosSql);
              // if (resultEmail.rowCount === 0) {
              if (result.length === 0) {
                const sql = `INSERT INTO myart_altalanos (azonosito, nev, leiras)
                          VALUES ('${felvitelObj.azonosito}', '${felvitelObj.nev}', '${felvitelObj.leiras}');`;
                          myArt.query(sql, (err) => {
                  if (!err) {
                    res.status(200).send({
                      msg: 'MyArt általános bejegyzés sikeresen hozzáadva!'
                    });
                  } else {
                    res.status(500).send({
                      err: err
                    });
                  }
                });
              } else {
                res.status(400).send({
                  err: "Ez a MyArt általános bejegyzés már létezik!",
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
              err: "MyArt általános bejegyzés adatainak megadása kötelező!"
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

router.put("/altalanos", async (req, res) => {
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
        if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ["SZUPER_ADMIN"])) {
          if (id) {
            modositoObj = JSON.parse(JSON.stringify(modositoObj));
            const sql = `UPDATE myart_altalanos SET azonosito='${modositoObj.azonosito}', nev='${modositoObj.nev}', leiras='${modositoObj.leiras}' WHERE id = '${id}';`;
            myArt.query(sql, (err) => {
              if (!err) {
                res
                  .status(200)
                  .send({
                    msg: "MyArt általános bejegyzés sikeresen módosítva!"
                  });
              } else {
                res
                  .status(500)
                  .send({
                    err: "MyArt általános bejegyzés módosítása sikertelen!"
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
              err: "MyArt általános bejegyzés adatainak megadása kötelező"
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

router.delete("/altalanos", (req, res) => {
  const token = req.cookies.JWT_TOKEN;
  const id = req.headers.id;
  if (token) {
    const user = validateToken(token, jwtparams.secret);
    if (user === null) {
      res.status(401).send({
        err: "Nincs belépve! Kérem jelentkezzen be!"
      });
    } else {
      if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
        if (id) {
          const sql = `DELETE FROM myart_altalanos WHERE id='${id}';`;
          myArt.query(sql, (err) => {
            if (!err) {
              res.status(200).send({
                msg: "MyArt általános bejegyzés sikeresen törölve!"
              });
            } else {
              res.status(500).send({
                err: "MyArt általános bejegyzés törlése sikertelen!"
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

// MYARTALTALANOS END

// MYARTGALERIAK START

router.get("/galeriak", async (req, res) => {
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
          const sql = `SELECT * FROM myart_galeriak WHERE id='${id}';`;
          myArt.query(sql, (err, result) => {
            if (!err) {
              if (hasRole(JSON.parse(user.roles), ["SZUPER_ADMIN"])) {
                let resss = result[0];
                if (resss.kepek) {
                    resss.kepek = JSON.parse(resss.kepek);
                    resss.isActive = resss.isActive === '0' ? true : false
                }
                // resss.isActive = resss.isActive === '0' ? true : false;
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
          const sql = `SELECT id, azonosito, nev, muveszNev, muveszTelefon, muveszEmail, muveszUrl, leiras, isActive FROM myart_galeriak;`;
          myArt.query(sql, (error, ress) => {
            if (error) {
              res.status(500).send({ err: 'Hiba történt a MyArt Általános bejegyzés lekérdezésekor!' });
            } else {
                let resss = ress;
                resss.forEach((item) => {
                    item.isActive = item.isActive === '0' ? true : false;
                })
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
  
  router.post("/galeriak", async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
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
          hasRole(JSON.parse(user.roles), ["SZUPER_ADMIN"])
        ) {
          let felvitelObj = req.body;
          if (felvitelObj) {
            felvitelObj = JSON.parse(JSON.stringify(felvitelObj));
            felvitelObj.isActive = felvitelObj.isActive === true ? '0' : '1';
            //store user, password and role
            const sql = `CREATE TABLE IF NOT EXISTS eobgycvo_myhome.myart_galeriak (
                      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                      azonosito text DEFAULT NULL,
                      nev text DEFAULT NULL,
                      muveszNev text DEFAULT NULL,
                      muveszTelefon text DEFAULT NULL,
                      muveszEmail text DEFAULT NULL,
                      muveszUrl text DEFAULT NULL,
                      kepek json DEFAULT NULL,
                      leiras text DEFAULT NULL,
                      isActive bool
                    ) ENGINE=InnoDB;`;
            myArt.query(sql, async (error) => {
              if (!error) {
                const myArtGaleriakSql =
                  `SELECT azonosito FROM myart_galeriak WHERE azonosito = '${felvitelObj.azonosito}';`;
                const result= await useQuery(myArt, myArtGaleriakSql);
                // if (resultEmail.rowCount === 0) {
                if (result.length === 0) {
                  const sql = `INSERT INTO myart_galeriak (azonosito, nev, muveszNev, muveszTelefon, muveszEmail, muveszUrl, kepek, leiras, isActive)
                            VALUES ('${felvitelObj.azonosito}', '${felvitelObj.nev}', '${felvitelObj.muveszNev}', '${felvitelObj.muveszTelefon}', '${felvitelObj.muveszEmail}', '${felvitelObj.muveszUrl}', '${JSON.stringify(felvitelObj.kepek)}', '${felvitelObj.leiras}', '${felvitelObj.isActive}');`;
                            myArt.query(sql, (err) => {
                    if (!err) {
                      res.status(200).send({
                        msg: 'MyArt galéria bejegyzés sikeresen hozzáadva!'
                      });
                    } else {
                      res.status(500).send({
                        err: err
                      });
                    }
                  });
                } else {
                  res.status(400).send({
                    err: "Ez a MyArt galéria bejegyzés már létezik!",
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
                err: "MyArt galéria bejegyzés adatainak megadása kötelező!"
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
  
  router.put("/galeriak", async (req, res) => {
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
          if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ["SZUPER_ADMIN"])) {
            if (id) {
              modositoObj = JSON.parse(JSON.stringify(modositoObj));
              modositoObj.isActive = modositoObj.isActive === true ? '0' : '1';
              const sql = `UPDATE myart_galeriak SET azonosito='${modositoObj.azonosito}', nev='${modositoObj.nev}', muveszNev='${modositoObj.muveszNev}', muveszTelefon='${modositoObj.muveszTelefon}', muveszEmail='${modositoObj.muveszEmail}', muveszUrl='${modositoObj.muveszUrl}', kepek='${JSON.stringify(modositoObj.kepek)}', leiras='${modositoObj.leiras}', isActive='${modositoObj.isActive}' WHERE id = '${id}';`;
              myArt.query(sql, (err) => {
                if (!err) {
                  res
                    .status(200)
                    .send({
                      msg: "MyArt galéria bejegyzés sikeresen módosítva!"
                    });
                } else {
                  res
                    .status(500)
                    .send({
                      err: "MyArt galéria bejegyzés módosítása sikertelen!"
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
                err: "MyArt galéria bejegyzés adatainak megadása kötelező"
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
  
  router.delete("/galeriak", (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    const id = req.headers.id;
    if (token) {
      const user = validateToken(token, jwtparams.secret);
      if (user === null) {
        res.status(401).send({
          err: "Nincs belépve! Kérem jelentkezzen be!"
        });
      } else {
        if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
          if (id) {
            const sql = `DELETE FROM myart_galeriak WHERE id='${id}';`;
            myArt.query(sql, (err) => {
              if (!err) {
                res.status(200).send({
                  msg: "MyArt galéria bejegyzés sikeresen törölve!"
                });
              } else {
                res.status(500).send({
                  err: "MyArt galéria bejegyzés törlése sikertelen!"
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
  
  // MYARTGALERIAK END

module.exports = router;