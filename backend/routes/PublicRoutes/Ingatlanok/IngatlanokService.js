// const { Pool } = require("pg");
const router = require('express').Router();
const { poolConnect, getTelepulesekByKm, getTypeForXml, getAllapotForXml, getKepekForXml, useQuery } = require('../../../common/QueryHelpers');
const ingatlanok = poolConnect();
const xml = require("xml");
const { existsSync, mkdirSync, writeFileSync, rmSync } = require('fs');
const path = require('path');

// INGATLANOK START

router.get('/', (req, res) => {
  
  const id = req.headers.id;
  const sql = id ? `SELECT id, cim, leiras, helyseg, irsz, telepules, ar, kaucio, statusz, tipus, allapot, emelet, alapterulet, telek, telektipus, beepithetoseg, viz, gaz, villany, szennyviz, szobaszam, felszobaszam, epitesmod, futes, isHirdetheto, isKiemelt, isErkely, isLift, isAktiv, isUjEpitesu, rogzitoNev, rogzitoEmail, rogzitoTelefon, rogzitoAvatar FROM ingatlanok WHERE id='${id};` : `SELECT id, cim, leiras, helyseg, irsz, telepules, ar, kaucio, statusz, tipus, allapot, emelet, alapterulet, telek, telektipus, beepithetoseg, viz, gaz, villany, szennyviz, szobaszam, felszobaszam, epitesmod, futes, isHirdetheto, isKiemelt, isErkely, isLift, isAktiv, isUjEpitesu, rogzitoNev, rogzitoEmail, rogzitoTelefon, rogzitoAvatar FROM ingatlanok;`;
  ingatlanok.query(sql, (err, result, rows) => {
    if (!err) {
      let ressss = result;
      ressss.map((ing) => {
        if (ing.kepek) {
          ing.helyseg = JSON.parse(ing.kepek);
        }
        if (ing.rogzitoAvatar) {
          JSON.parse(ing.rogzitoAvatar);
        }
        ing.helyseg = JSON.parse(ing.helyseg);
        ing.isHirdetheto = ing.isHirdetheto === 0 ? true : false;
        ing.isKiemelt = ing.isKiemelt === 0 ? true : false;
        ing.isErkely = ing.isErkely === 0 ? true : false;
        ing.isLift = ing.isLift === 0 ? true : false;
        ing.isAktiv = ing.isAktiv === 0 ? true : false;
        ing.isUjEpitesu = ing.isUjEpitesu === 0 ? true : false;
      });
      res.status(200).send(ressss);
    } else {
      res.status(500).send({ err: err });
    }
  });
});

router.get('/aktiv', (req, res) => {
  // const id = req.headers.id;
  const id = req.headers.id;

  const sql = id ? `SELECT * FROM ingatlanok WHERE id='${id}' AND isAktiv='0'` : `SELECT id, refid, cim, leiras, helyseg, irsz, telepules, ar, kepek, kaucio, penznem, statusz, tipus, allapot, emelet, alapterulet, telek, telektipus, beepithetoseg, viz, gaz, villany, szennyviz, szobaszam, felszobaszam, epitesmod, futes, isHirdetheto, isKiemelt, isErkely, isLift, isAktiv, isUjEpitesu, rogzitoNev, rogzitoEmail, rogzitoTelefon FROM ingatlanok WHERE isAktiv='0';`;
  ingatlanok.query(sql, (err, result, rows) => {
    if (!err) {
      let ressss = result;
      ressss.map((ing) => {
        ing.kepek = JSON.parse(ing.kepek);
        if (!id) {
          ing.kepek = ing.kepek.filter((kep) => kep.isCover);
          
        } else {
          ing.rogzitoAvatar = JSON.parse(ing.rogzitoAvatar)
        }

        
        ing.helyseg = JSON.parse(ing.helyseg);
        ing.isHirdetheto = ing.isHirdetheto === 0 ? true : false;
        ing.isKiemelt = ing.isKiemelt === 0 ? true : false;
        ing.isErkely = ing.isErkely === 0 ? true : false;
        ing.isLift = ing.isLift === 0 ? true : false;
        ing.isAktiv = ing.isAktiv === 0 ? true : false;
        ing.isUjEpitesu = ing.isUjEpitesu === 0 ? true : false;
      });
      res.status(200).send(ressss);
    } else {
      res.status(500).send({ err: err });
    }
  });
});

router.get('/ingatlan/:id', (req, res) => {
  // const id = req.headers.id;
  const id = req.headers.id;
  const sql = id ? `SELECT * FROM ingatlanok WHERE id='${id}' AND isAktiv='0'` : `SELECT id, cim, leiras, helyseg, irsz, telepules, ar, kepek, kaucio, statusz, tipus, allapot, emelet, alapterulet, telek, telektipus, beepithetoseg, viz, gaz, villany, szennyviz, szobaszam, felszobaszam, epitesmod, futes, isHirdetheto, isKiemelt, isErkely, isLift, isAktiv, isUjEpitesu, rogzitoNev, rogzitoEmail, rogzitoTelefon FROM ingatlanok WHERE isAktiv='0';`;
  ingatlanok.query(sql, (err, result, rows) => {
    if (!err) {
      let ressss = result;
      ressss.map((ing) => {
        ing.kepek = JSON.parse(ing.kepek);
        if (!id) {
          ing.kepek = ing.kepek.filter((kep) => kep.isCover);
          
        } else {
          ing.rogzitoAvatar = JSON.parse(ing.rogzitoAvatar)
        }

        
        ing.helyseg = JSON.parse(ing.helyseg);
        ing.isHirdetheto = ing.isHirdetheto === 0 ? true : false;
        ing.isKiemelt = ing.isKiemelt === 0 ? true : false;
        ing.isErkely = ing.isErkely === 0 ? true : false;
        ing.isLift = ing.isLift === 0 ? true : false;
        ing.isAktiv = ing.isAktiv === 0 ? true : false;
        ing.isUjEpitesu = ing.isUjEpitesu === 0 ? true : false;
      });
      res.status(200).send(ressss);
    } else {
      res.status(500).send({ err: err });
    }
  });
});

router.get('/ujepites', (req, res) => {
  const id = req.headers.id;
  const sql = id ? `SELECT * FROM ingatlanok WHERE id='${id}' AND isUjEpitesu='0'` : `SELECT * FROM ingatlanok WHERE isUjEpitesu='0';`;
  ingatlanok.query(sql, (err, result, rows) => {
    if (!err) {
      let ressss = result;
      ressss.map((ing) => {
        ing.kepek = JSON.parse(ing.kepek);
        if (!id) {
          ing.kepek = ing.kepek.filter((kep) => kep.isCover);
          ing.rogzitoAvatar = JSON.parse(ing.rogzitoAvatar)
        }
        ing.helyseg = JSON.parse(ing.helyseg);
        ing.isHirdetheto = ing.isHirdetheto === 0 ? true : false;
        ing.isKiemelt = ing.isKiemelt === 0 ? true : false;
        ing.isErkely = ing.isErkely === 0 ? true : false;
        ing.isLift = ing.isLift === 0 ? true : false;
        ing.isAktiv = ing.isAktiv === 0 ? true : false;
        ing.isUjEpitesu = ing.isUjEpitesu === 0 ? true : false;
      });
      res.status(200).send(ressss);
    } else {
      res.status(500).send({ err: err });
    }
  });
});

router.post('/keres', async (req, res) => {
  let kereso = req.body;
  kereso = JSON.parse(JSON.stringify(kereso));
  const keys = Object.keys(kereso);

  let where = '';
  let newWhere = '';
  if (kereso['referenciaSzam'] !== '') {
    where = where.concat(`refid = '${kereso.referenciaSzam}' AND`);
  } else  {
    keys.forEach((filter) => {
      if (kereso[filter] !== '' && kereso[filter] !== false && filter !== 'irszam' && filter !== 'telepules') {
        if (filter === 'telek' || filter === 'alapterulet' || filter === 'ar' || filter === 'isHirdetheto' || filter === 'isKiemelt' || filter === 'isLift' || filter === 'isErkely' || filter !== 'irszam' || filter === 'statusz' || filter === 'tipus' || filter === 'szobaszam' || filter === 'emelet' || filter === 'epitesmod' || filter === 'futes' || filter === 'allapot') {
          if (filter === 'telek' || filter === 'alapterulet') {
            where = where.concat(`${filter}>='${kereso[filter]}' AND `)
          } 
          if (filter === 'ar') {
            where = where.concat(`${filter}<=${kereso[filter]} AND `)
          }
          if (filter === 'isHirdetheto' || filter === 'isKiemelt' || filter === 'isLift' || filter === 'isErkely' || filter === 'isUjEpitesu') {
            where = where.concat(`${filter}='${0}' AND `)
          }
          if (filter === 'statusz' || filter === 'tipus' || filter === 'szobaszam' || filter === 'emelet' || filter === 'epitesmod' || filter === 'futes' || filter === 'allapot') {
            where = where.concat(`${filter}='${kereso[filter]}' AND `)
          }
          
        }
      }   
    });
  }

  if (kereso['telepules']) {
    if (kereso['telepules'].km > 0) {
        let km = kereso['telepules'].km;
        let telepnev = kereso['telepules'].telepulesnev;
        let irszam = kereso['telepules'].irszam;
        const nearTelep = await getTelepulesekByKm(ingatlanok, telepnev, irszam, km);
        let telepek = nearTelep.map((telep, index) => {
            return `'${telep.telepulesnev}'`;
          });
          newWhere = `telepules IN(${telepek})`;
    } else {
      if (kereso['telepules'].telepulesnev !== '') {
        newWhere = newWhere.concat(`telepules='${kereso['telepules'].telepulesnev}' AND `);
      }
      if (kereso['telepules'].irszam !== '') {
        newWhere = newWhere.concat(`irsz='${kereso['telepules'].irszam}' AND `);
      }
    }

    // where = where.concat(newWhere);
    
}

  let result = where.lastIndexOf("AND");
  if (result !== -1) {
    where = where.slice(0, (result - 1));
  }

  let resultNew = newWhere.lastIndexOf("AND");
  if (resultNew !== -1) {
    newWhere = newWhere.slice(0, (resultNew - 1));
  }
  
  let sql = `SELECT * FROM ingatlanok WHERE isAktiv='0' ${where !== '' ? `AND ` + where : ''} ${newWhere !== '' ? `AND ` + newWhere : ''};`;
  ingatlanok.query(sql, (err, result) => {
    if (!err) {
      let ressss = result;
      ressss.map((ing) => {
        ing.kepek = JSON.parse(ing.kepek);
        ing.kepek = ing.kepek.filter((kep) => kep.isCover);
        ing.helyseg = JSON.parse(ing.helyseg);
        ing.isHirdetheto = ing.isHirdetheto === 0 ? true : false;
        ing.isKiemelt = ing.isKiemelt === 0 ? true : false;
        ing.isErkely = ing.isErkely === 0 ? true : false;
        ing.isLift = ing.isLift === 0 ? true : false;
        ing.isAktiv = ing.isAktiv === 0 ? true : false;
        ing.isUjEpitesu = ing.isUjEpitesu === 0 ? true : false;
      });
      res.status(200).send(ressss);
    } else {
      res.status(500).send({ err: err });
    }
  });
});

router.get("/ingatlanokapi", (req, res, next) => {
  let sql = `SELECT * FROM ingatlanok WHERE isAktiv='0' AND isHirdetheto='0';`;
  let data = `<?xml version="1.0" encoding="UTF-8"?>`;
  data += `<items>`;
  ingatlanok.query(sql, async (error, result) => {
    const ingatlanJson = result;
    if (!error) {
      await Promise.all(ingatlanJson.map(async (ingatlan) => {
        const getLatLongSql = `SELECT geoLat, geoLong FROM telep_1 WHERE irszam='${ingatlan.irsz}';`
        const latLong = await useQuery(ingatlanok, getLatLongSql);
        const kepek = JSON.parse(ingatlan.kepek);
        data += `<item refnum="${ingatlan.refid}"> 
        <agent-name>${ingatlan.rogzitoNev}</agent-name>
        <agent-email>${ingatlan.rogzitoEmail}</agent-email>
        <agent-phone>${ingatlan.rogzitoTelefon}</agent-phone>
        <status>${'Akt??v'}</status>
        <type>${getTypeForXml(ingatlan.tipus)}</type>
        <refnum>${ingatlan.refid}</refnum>
        <city>${ingatlan.telepules}</city>
        <zip>${ingatlan.irsz}</zip>
        <mbtyp>${ingatlan.statusz}</mbtyp>
        <price>${ingatlan.ar}</price>
        <currency>${'HUF'}</currency>
        ${ingatlan.tipus !== 'Telek' && ingatlan.tipus !== 'Fejleszt??si ter??let' && ingatlan.tipus !== 'Mez??gazdas??gi ter??let' && 
          `<sqrm>${ingatlan.alapterulet}</sqrm>`
        }
        ${ingatlan.tipus === 'Telek' || ingatlan.tipus === 'Fejleszt??si ter??let' || ingatlan.tipus === 'Mez??gazdas??gi ter??let' ? 
          `<land>${ingatlan.telek}</land>
           <ltyp>Egy??b</ltyp>
          `
        : ''}
        <note>
        <![CDATA[${ingatlan.leiras}]]>
        </note>
        <lat>${latLong[0].geoLat}</lat>
        <lng>${latLong[0].geoLong}</lng>
  
        ${getAllapotForXml(ingatlan.allapot, ingatlan.tipus)}
        ${ingatlan.emelet ? `<floor>${ingatlan.emelet}</floor>` : ''}
        <builds>${ingatlan.epitesmod}</builds>
        <htyp>${ingatlan.futes}</htyp>
        <images>
          ${getKepekForXml(kepek, data)}
        </images>
        </item>`;
        return data
      }))
      data += `</items>`;
      const dir = `/home/eobgycvo/public_html/xml/ingatlanok/`;
      let exist = existsSync(dir);
      if (!exist) {
        mkdirSync(path.normalize(dir));
        
      }
      writeFileSync(path.join(dir, 'ingatlanapi.xml'), data);
      writeFileSync(path.join(dir, 'ingatlanapi.txt'), data);
      res.status(200).send({ msg: 'XML file gener??l??sa sikeres!' });
      } else {
        res.status(500).send({ err: 'XML file gener??l??sa sikertelen!' })
      }
    
    });
});


// INGATLANOK END



module.exports = router;