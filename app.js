const express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
const FileStore = require("session-file-store")(session);
var cors = require("cors");
var cookieParser = require("cookie-parser");

const DataAccessLayer = require("./code/DAL/DataAccessLayer");
const Signup = require("./code/auth/signup");
const VerifySignup = require("./code/auth/verifySignup")
/* #region  init express app */
//Intiate Server App
const app = express();

//enable cross origin request
const corsConfig = {
  origin: true,
  credentials: true,
};

//app.use(cors());
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.use(cookieParser());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});

//Parses Request Body - TO DO LOOK INTO TWO BODY PARSER EFFECT
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//define session variables
app.use(
  session({
    store: new FileStore(),
    secret: "Shh, its a secret!",
    resave: true,
    saveUninitialized: true,
    cookie: { httpOnly: false },
  })
);

/* #endregion */

/* #region  api requests */

//signup request
app.post("/signup", function (req, res) {
  console.log("request signup recieved");
  console.log(req.body);

  var firstName =
    req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.slice(1);
  var lastName =
    req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.slice(1);

  response = {
    userName: firstName + " ." + lastName.charAt(0),
    name: firstName,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    isOtpChecked: false,
    profileImage: null,
  };

  Signup(response).then((value) => {
    console.log(value);
    res.send(value);
  });
});


//checkOTP
app.post("/checkOTP", function (req, res) {
  console.log("request signup recieved");
  console.log(req.body);

  response = {
    otp: req.body.otp,
    phoneNumber: req.body.phoneNumber,
  };

  VerifySignup(response).then((value) => {
    console.log(value);
    res.send(value);
  });
});




app.get("/", (req, res) => {
  var query = `
          INSERT INTO u138139769_akhlaquna.temp
          (name,pass) VALUES
          (?,?);`;

  query = "select * from temp where id = 2";
  var values = ["testa5", "234234"];
  DataAccessLayer.ExcuteCommand(query).then((e) => {
    console.log(e);
  });

  res.send("done");
});

/* #endregion */

app.listen(2008, () => {
  console.log("Server running on port 2008");
});
