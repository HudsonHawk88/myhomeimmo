/* eslint-disable no-eval */
// DEPENDENCIES
const path = require('path');
require('dotenv').config({
  path: path.join(__dirname,'.env'),
});
// require('dotenv').config({
//   path: path.join(__dirname,'.myhome.env'),
// });
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser')
const fs = require("fs");
const http = require("http");
//const https = require("https");
const host = process.env.HOST ? process.env.HOST : "localhost";
const port = process.env.PORT;
const cookieParser = require('cookie-parser');

const server = http.createServer(app);
//const server = https.createServer(
//  {
//    key: fs.readFileSync(process.env.KEY_FILE),
//    cert: fs.readFileSync(process.env.CERT_FILE)
//  },
//    app
//);

// VARIABLES
const routesJson = require("./routes.json");

// const publicAuthSerice = require("./routes/PublicRoutes/AuthService/AuthService");
const adminAuthService = require('./routes/AdminRoutes/AdminAuthServices/AdminAuthServices');
//const publicusersServices = require('./routes/PublicRoutes/UserServices/UserService');
const adminusersServices = require('./routes/AdminRoutes/AdminUsersServices/AdminUsersServices');
const adminrolesServices = require('./routes/AdminRoutes/AdminRoles/AdminRoles');
const ingatlanokServices = require('./routes/PublicRoutes/Ingatlanok/IngatlanokService');
const adminIngatlanSzolg = require('./routes/AdminRoutes/AdminIngatlanSzolgaltatasokService/AdminIngatlanSzolgaltatasokService');
const adminPenzugySzolg = require('./routes/AdminRoutes/AdminPenzugyiSzolgaltatasokService/AdminPenzugyiSzolgaltatasokService');
const publicIngatlanSzolg = require('./routes/PublicRoutes/IngatlanSzolgService/IngatlanSzolgServices');
const publicPenzugySzolg = require('./routes/PublicRoutes/PenzugyiSzolgService/PenzugyiSzolgServices');
const adminIngatlanokService = require('./routes/AdminRoutes/IngatlanokServices/IngatlanokService');
const adminGdpr = require('./routes/AdminRoutes/AdminGDPR/AdminGDPRServices');
const publicGdpr = require('./routes/PublicRoutes/GDPR/publicGDPRServices');
const publicRolunk = require('./routes/PublicRoutes/Rolunk/PublicRolunkServices');
const adminRolunk = require('./routes/AdminRoutes/AdminRólunkServices/AdminRolunkServices');
const adminKapcsolat = require('./routes/AdminRoutes/AdminKapcsolatServices/AdminKapcsolatServices');
const publicKapcsolat = require('./routes/PublicRoutes/KapcsolatService/KapcsolatServices');
const adminMyArt = require('./routes/AdminRoutes/AdminMyArtGaleriaServices/AdminMyArtGaleriaServices');
const publicMyArt = require('./routes/PublicRoutes/MyArt/publicMyArtServices');
const orszagokService = require("./routes/common/OrszagokService/OrszagokService");
const telepulesekService = require("./routes/common/TelepulesekService/TelepulesekService");
const mailerService = require("./routes/common/MailerService/MailerService");
const ocDataServices = require("./routes/common/OcDataService/OcDataServices");

app.use(express.json({
  limit: '150mb'
}));
app.use(cookieParser());
app.use(routesJson.routes, (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://192.168.11.64:3000");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  return next();
});

app.options("*", cors());
app.use(cookieParser());
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// const multer = require('multer');
// const upload = multer({ 
//   dest: 'uploads/'
//  })
// app.use(upload.any());
// PUBLIC AUTH
// app.use(publicAuthSerice);
app.use(["/"], ocDataServices);
app.use(["/admin"], adminAuthService);
// PUBLIC USERS
// //app.use(["/users"], publicusersServices);
// ADMINROLES
app.use(["/admin/roles"], adminrolesServices);
// ADMINUSERS
app.use(["/admin/users"], adminusersServices);
// INGATLANOK
app.use(["/ingatlanok"], ingatlanokServices);
app.use(["/admin/ingatlanok"], adminIngatlanokService);
// SZOLGALTATASOK
app.use(["/admin/ingatlanszolg"], adminIngatlanSzolg);
app.use(["/admin/penzugyszolg"], adminPenzugySzolg);
app.use(["/ingatlanszolg"], publicIngatlanSzolg);
app.use(["/penzugyszolg"], publicPenzugySzolg);
// GDPR
app.use(["/admin/gdpr"], adminGdpr);
app.use(["/gdpr"], publicGdpr);
// ROLUNK
app.use(["/admin/rolunk"], adminRolunk);
app.use(["/rolunk"], publicRolunk);
// KAPCSOLAT
app.use(["/admin/kapcsolat"], adminKapcsolat);
app.use(["/kapcsolat"], publicKapcsolat);
// MYART
app.use(["/admin/myart"], adminMyArt);
app.use(["/myart"], publicMyArt);
// ORSZAGOK
app.use(["/orszagok"], orszagokService);
// TELEPULESEK
app.use(["/telepulesek"], telepulesekService);
// MAIL
app.use(["/contactmail"], mailerService);

server.listen(port, host);

console.log(`Server running at https://${host}:${port}/`);
