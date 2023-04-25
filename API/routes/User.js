const router = require("express").Router();
const use = require("../models/User");
const {
  verify,
  verifytokenandauthorization,
  verifytokenandadmin,
} = require("./verifytoken");
const CryptoJS = require("crypto-js");
router.put("/:id", verifytokenandauthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  use
    .findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
    .then((re) => {
      res.status(203).send(re);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.delete("/:id", verifytokenandauthorization, (req, res) => {
  use
    .findByIdAndDelete(req.params.id)
    .then((re) => {
      res.status(200).send("use deleted");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get("/find/:id", verifytokenandadmin, (req, res) => {
  use
    .findById(req.params.id)
    .then((re) => {
      const { password, ...others } = re._doc;
      res.status(200).send(others);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get("/", verifytokenandadmin, async (req, res) => {
  const query = req.query.new;
  try {
    const us = query
      ? await use.find().sort({ _id: -1 }).limit(5)
      : await use.find();
    //console.log(us)
    res.status(200).send(us);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/stats", verifytokenandadmin ,async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  console.log(lastYear)
  try {
   const data = await use.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      { $project: { month: { $month: '$createdAt' } } },
      {
        $group: {
          _id: '$month',
          total: { $sum: 1 },
        },
      },
    ]);

    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});
module.exports = router;
