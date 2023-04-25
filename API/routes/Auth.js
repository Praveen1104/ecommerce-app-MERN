const router = require("express").Router();
const user = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
router.post("/register", (req, res) => {
  const newuser = new user({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });
  newuser
    .save()
    .then((re) => {
      res.status(201).send(re);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});
//login
router.post("/login", (req, res) => {
  user
    .findOne({ username: req.body.username })
    .then((re) => {
      console.log(re);
      if (!re) {
        return res.status(401).send("wrong name");
      }
      const hash = CryptoJS.AES.decrypt(re.password, process.env.PASS_SEC);
      const pass = hash.toString(CryptoJS.enc.Utf8);
      if (pass !== req.body.password) {
        return res.status(401).send("wrong password");
      }
      const accesstoken = jwt.sign(
        {
          id: re._id,
          isAdmin: re.isAdmin,
        },
        process.env.JWT_SEC,
        { expiresIn: "10d" }
      );
      const { password, ...others } = re._doc;
      res.status(201).send({...others,accesstoken});
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
module.exports = router;
