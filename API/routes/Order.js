const router = require("express").Router();
const order = require("../models/Order");
const {
  verifye,
  verifytokenandauthorization,
  verifytokenandadmin,
} = require("./verifytoken");
const CryptoJS = require("crypto-js");

router.post("/", verifye, async (req, res) => {
  const neworder = new order(req.body);
  try {
    const saveorder = await neworder.save();
    res.status(200).send(saveorder);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", verifytokenandadmin, async (req, res) => {
  try {
    const updateorder = await order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).send(updateorder);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/:id", verifytokenandadmin, (req, res) => {
  order
    .findByIdAndDelete(req.params.id)
    .then((re) => {
      res.status(200).send("order deleted");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get("/find/:userId", verifytokenandauthorization, (req, res) => {
  order
    .findOne({ userId: req.params.userId })
    .then((re) => {
      res.status(200).send(re);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get("/", verifytokenandadmin, async (req, res) => {
  try {
    const orders = await order.find();
    res.status(200).send(orders);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/income", verifytokenandadmin, async (req, res) => {
    const productId=req.query.productId
  const date = new Date();
  const lastmonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousmonth = new Date(new Date().setMonth(lastmonth.getMonth() - 1));

  try {
    const income = await order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousmonth },
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      { $project: { month: { $month: '$createdAt' }, sales: '$amount' } },
      {
        $group: {
          _id: '$month',
          total: { $sum: '$sales' },
        },
      },
    ]);

    res.status(200).send(income);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
