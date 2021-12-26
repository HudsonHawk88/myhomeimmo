const { jwtparams, useQuery, poolConnect, validateToken } = require('../../../common/QueryHelpers');
const adminusers = poolConnect();
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post("/token", async (req, res) => {
  const token = req.headers.refreshtoken;
  const user = validateToken(token, jwtparams.refresh);
  if (user === null) {
    const sql = `UPDATE adminusers SET token=NULL WHERE token='${token}';`;
    adminusers.query(sql, (error) => {
        if (!error) {
        res.sendStatus(200);
        } else {
        res.status(500).send({ err: error });
        }
    });
    return;
  } else {
    //now that we know the refresh token is valid 
    //lets take an extra hit the database 
    const sql = `SELECT username, roles, avatar, email, nev, telefon FROM adminusers WHERE token = '${token}';`;
    const result = await useQuery(adminusers, sql);
      if (result.length === 0) {
        res.sendStatus(401);
      } else {
        const user = result[0];
        const getUserAvatarSql = `SELECT avatar FROM adminusers WHERE email='${user.email}'`;
        const userAvatar = await useQuery(adminusers, getUserAvatarSql);
        user.roles = user.roles ? user.roles : []
        const avatar = userAvatar ? userAvatar[0].avatar : [];
        user.telefon = user.telefon ? user.telefon : {};
        user.nev = user.nev ? user.nev : {};
        //sign my jwt 
        const payLoad = { "name": user.username, "roles": user.roles, "email": user.email, "telefon": user.telefon, "nev": user.nev }
        //sign a brand new accesstoken and update the cookie
        const token = jwt.sign(payLoad, jwtparams.secret , { algorithm: 'HS256', expiresIn: jwtparams.expire})
        //maybe check if it succeeds..                          
        res.setHeader("set-cookie", [`JWT_TOKEN=${token}; httponly;`])  
        res.status(200).send({ user: { username: user.username, avatar: JSON.parse(avatar), roles: JSON.parse(user.roles), email: user.email, telefon: JSON.parse(user.telefon), nev: JSON.parse(user.nev) }, token: token })
      }
    }
});

router.post("/login", async (req, res) => {
  try { 
  let userObj = req.body
  // userObj = JSON.parse(userObj);
  if (userObj) {
    const sql = `SELECT username, password, roles, avatar, nev, telefon, email FROM adminusers WHERE email = '${userObj.email}'`
    
    const result = await useQuery(adminusers, sql);
    //fail
    if (result.length === 0) {
      res.status(403).send({ err: "Nincs ilyen felhasználó regisztrálva!" })
    } else {
      //compare salted password
      const saltedPassword = await result[0].password;
      
      const successResult = bcrypt.compareSync(userObj.password, saltedPassword);
      bcrypt.compareSync(userObj.password, saltedPassword)
    
      //logged in successfully generate session
      if (successResult === true) {
        const user = result[0];
        const getUserAvatarSql = `SELECT avatar FROM adminusers WHERE email='${user.email}'`;
        const userAvatar = await useQuery(adminusers, getUserAvatarSql);
        user.roles = user.roles ? user.roles : null;
        const avatar = userAvatar ? userAvatar[0].avatar : [];
        user.telefon = user.telefon ? user.telefon : {};
        user.nev = user.nev ? user.nev : {};
        //sign my jwt 
        const payLoad = { "name": user.username, "roles": user.roles, "email": user.email, "telefon": user.telefon, "nev": user.nev }
        const token = jwt.sign(payLoad, jwtparams.secret , { algorithm: 'HS256', expiresIn: jwtparams.expire})
        const refreshtoken = jwt.sign(payLoad, jwtparams.refresh, { algorithm: 'HS256'})
        const updateSql = `UPDATE adminusers SET token = '${refreshtoken}' WHERE email = '${user.email}';`;
        //save the refresh token in the database 
        adminusers.query(updateSql, (errrrr) => {
          if (!errrrr) {
            res.setHeader("set-cookie", [`JWT_TOKEN=${token}; httponly;`])
            res.status(200).send({ user: { username: user.username, avatar: JSON.parse(avatar), roles: JSON.parse(user.roles), email: user.email, telefon: JSON.parse(user.telefon), nev: JSON.parse(user.nev) }, refreshToken: refreshtoken })
          }
        })
        //maybe check if it succeeds..                    
        
      } else {
        res.status(403).send({ err: "Helytelen jelszó!" })
      }
    }
  } else {
    res
      .status(400)
      .send({ err: "Email cím és jelszó megadása kötelező" });
  }

  } catch (ex){
    console.error(ex)
  }    
});

router.post("/logout", (req, res) => {

  //logging out 
  const token = req.headers.token;
  if (token) {
      const sql = `UPDATE adminusers SET token=NULL WHERE token='${token}';`
      adminusers.query(sql, (error) => {
        if (!error) {
          res.status(200).send({ msg: 'Sikeresen kijelentkezett!' });
        } else {
          res.status(400).send({ err: error })
        }
      });
  } else {
    res
      .status(400)
      .send({ err: "Token megadása kötelező" });
  }
})

module.exports = router;




