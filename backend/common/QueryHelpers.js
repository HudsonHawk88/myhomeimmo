const mysql = require("mysql2");
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');

const poolConnect = () => {
  const db_params = {
    host: process.env.dbhost,
    user: process.env.dbuser,
    password: process.env.dbpass,
    database: process.env.database,
  };

  return mysql.createPool(db_params);
};

const jwtparams = {
  secret: process.env.JWT_SECRET,
  refresh: process.env.JWT_REFRESH_SECRET,
  expire: process.env.JWT_EXPIRE,
};

const useQuery = (pool, sql) => {
  return new Promise((data) => {
    // console.log(pool)
    pool.query(sql, function (error, result, ff) {
      // change db->connection for your code
      if (error) {
        // console.log(error);
        throw error;
      }
      try {
        data(result);
      } catch (error) {
        data([]);
        throw error;
      }
    });
  });
};

const validateToken = (token, secret) => {
  try {
    const result = jwt.verify(token, secret);

    return {
      name: result.name,
      roles: result.roles,
      email: result.email,
      avatar: result.avatar,
    };
  } catch (ex) {
    return null;
  }
};

const hasRole = (userRoles, minRoles) => {
  let result = false;
  userRoles.forEach((userrole) => {
    if (minRoles.includes(userrole.value)) {
      result = true;
    }
  });

  return result;
};

const getTelepulesekByKm = async (pool, telepules, irszam, km) => {
  const getCoordinatesSql = irszam ? `SELECT geoLong, geoLat FROM telep_1 WHERE irszam='${irszam}'` : `SELECT geoLong, geoLat FROM telep_1 WHERE telepulesnev='${telepules}'`;
  const coordinates = await useQuery(pool, getCoordinatesSql);
  const sql = `
  SELECT id, telepulesnev, ROUND((6371 * acos(cos(radians(${coordinates[0].geoLat})) * cos(radians(geoLat)) * cos(radians(geoLong) - radians(${coordinates[0].geoLong})) + sin(radians(${coordinates[0].geoLat})) * sin(radians(geoLat)))), (2)) 
  AS distance
  FROM telep_1
  GROUP BY telepulesnev
  HAVING distance < '${km}'
  ORDER BY distance;`;
  const nearTelepulesek = await useQuery(pool, sql);

  return nearTelepulesek;
} 

const createIngatlanokSql = `
    CREATE TABLE IF NOT EXISTS eobgycvo_myhome.ingatlanok (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        refid text DEFAULT NULL,
        cim text DEFAULT NULL,
        leiras text DEFAULT NULL,
        helyseg json DEFAULT NULL,
        irsz text DEFAULT NULL,
        telepules text DEFAULT NULL,
        kepek json DEFAULT NULL,
        ar text DEFAULT NULL,
        kaucio text DEFAULT NULL,
        statusz text DEFAULT NULL,
        tipus text DEFAULT NULL,
        allapot text DEFAULT NULL,
        emelet text DEFAULT NULL,
        alapterulet text DEFAULT NULL,
        telek text DEFAULT NULL,
        telektipus text DEFAULT NULL,
        beepithetoseg text DEFAULT NULL,
        viz text DEFAULT NULL,
        gaz text DEFAULT NULL,
        villany text DEFAULT NULL,
        szennyviz text DEFAULT NULL,
        szobaszam text DEFAULT NULL,
        felszobaszam text DEFAULT NULL,
        epitesmod text DEFAULT NULL,
        futes text DEFAULT NULL,
        isHirdetheto BOOLEAN,
        isKiemelt BOOLEAN,
        isErkely BOOLEAN,
        isLift BOOLEAN,
        isAktiv BOOLEAN,
        isUjEpitesu BOOLEAN,
        rogzitIdo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        rogzitoNev text NOT NULL,
        rogzitoEmail text NOT NULL,
        rogzitoTelefon text NOT NULL,
        rogzitoAvatar json DEFAULT NULL
    ) ENGINE=InnoDB;
`;

const createIngatlanokTriggerSql = `
CREATE TRIGGER IF NOT EXISTS trigger_refid 
BEFORE INSERT 
ON ingatlanok 
FOR EACH ROW 
IF (NEW.refid IS NULL) THEN 
SELECT MAX(refid) INTO @max_refid 
FROM ingatlanok 
WHERE tipus = NEW.tipus; 
IF (@max_refid IS NULL) THEN 
SET @refid =
CASE NEW.tipus 
WHEN 'Lakás' THEN 'hm-lk-' 
WHEN 'Családi ház' THEN 'hm-hz-' 
WHEN 'Telek' THEN 'hm-tk-' 
WHEN 'Ipari ingatlan' THEN 'hm-ip-' 
WHEN 'Fejlesztési terület' THEN 'hm-ft-' 
WHEN 'Üzlethelyiség' THEN 'hm-uz-' 
WHEN 'Iroda' THEN 'hm-ir-' 
WHEN 'Garázs' THEN 'hm-gz-' 
WHEN 'Mezőgazdasági terület' THEN 'hm-mg-' 
WHEN 'Vendéglátóhely' THEN 'hm-vh-' 
WHEN 'Irodaház' THEN 'hm-ih-' 
WHEN 'Szálláshely' THEN 'hm-sh-' 
WHEN 'Ikerház' THEN 'hm-ik-' 
WHEN 'Sorház' THEN 'hm-so-' 
WHEN 'Raktár' THEN 'hm-ra-' 
WHEN 'Hétvégi ház/nyaraló' THEN 'hm-ny-' 
ELSE 'UNKNOWN' 
END; 
SET NEW.refid = CONCAT(@refid, '000001'); 
ELSE SET NEW.refid = CONCAT(SUBSTR(@max_refid, 1, 6), LPAD(SUBSTR(@max_refid, 7) + 1, 6, '0')); 
END IF; 
END IF;`;

const uploadFile = (files, upload) => {
  
  // upload(req, res, function (err) {
  //     if (err instanceof multer.MulterError) {
  //       console.log(err)
  //         // A Multer error occurred when uploading.
  //     } else if (err) {
  //       console.log(err)
  //         // An unknown error occurred when uploading.
  //     }
  //     console.log(files)
  //     // Everything went fine. 
  //     next()
  // })
}

exports.poolConnect = poolConnect;
exports.jwtparams = jwtparams;
exports.useQuery = useQuery;
exports.validateToken = validateToken;
exports.hasRole = hasRole;
exports.createIngatlanokSql = createIngatlanokSql;
exports.createIngatlanokTriggerSql = createIngatlanokTriggerSql;
exports.getTelepulesekByKm = getTelepulesekByKm;
exports.uploadFile = uploadFile;
