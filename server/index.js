const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const session = require("express-session")
const bcrypt = require("bcrypt")

const { createToken, validateToken } = require("./JWT")

const saltRounds = 10

const app = express()

app.use(express.json())
app.use(
    cors({
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    })
)
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        key: "userId",
        secret: "subscribe",
        resave: false,
        saveUninitialized: false,
        cookie: {
        expires: 60 * 60 * 24,
        },
    })
)

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "P@ssw0rd",
    database: "chengbao",
})

app.post("/register", (req, res) => {
    const {
      username,
      password,
      gender,
      phone,
      address,
      role,
      school
    } = req.body
  
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log(err)
      }
  
      db.query(
        "INSERT INTO users (username, password, gender, phone, address, role, school) VALUES (?,?,?,?,?,?,?)",
        [username, hash, gender, phone, address, role, school],
        (err, result) => {
          console.log(result)
          return res.status(200)
        }
      )
    })
})

app.post("/login", (req, res) => {
  const { username, password } = req.body

  db.query(
    "SELECT * FROM users WHERE username = ?;",
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          console.log("response: ", response, "----result: ", result)
          if (response) {
            const accessToken = createToken(result)

            req.session.user = result;
            console.log(req.session.user);
            res.cookie("access-token", accessToken, {
              maxAge: 60 * 60 * 24 * 1000,
              httpOnly: true
            })
            res.json({auth: true, token: accessToken, result})
          } else {
            res.send({ message: "Wrong username/password combination!" })
          }
        });
      } else {
        res.send({ message: "User doesn't exist" })
      }
    }
  )
})

app.listen(3001, () => {
    console.log("running server");
});