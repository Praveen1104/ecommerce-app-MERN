const router = require("express").Router();
const cart = require("../models/Cart");
const {
  verifye,
  verifytokenandauthorization,
  verifytokenandadmin,
} = require("./verifytoken");
const CryptoJS = require("crypto-js");

router.post("/", verifye, async (req, res) => {
  const newcart = new cart(req.body);
  try {
    const saveproduct = await newproduct.save();
    res.status(200).send(saveproduct);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", verifytokenandauthorization, async (req, res) => {
  try {
    const updatecart = await cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).send(updatecart)
  } catch (err) {
    res.status(500).send(err)
  }
});

router.delete("/:id", verifytokenandauthorization, (req, res) => {
  cart
    .findByIdAndDelete(req.params.id)
    .then((re) => {
      res.status(200).send("cart deleted");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get("/find/:userId", verifytokenandauthorization, (req, res) => {
  cart
    .findOne({userId: req.params.userId})
    .then((re) => {
      res.status(200).send(re);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get("/",verifytokenandadmin, async (req, res) => {
  
  try {
    const carts= await cart.find()
    res.status(200).send(carts);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
