const router = require("express").Router();
const product = require("../models/Product");
const {
  verify,
  verifytokenandauthorization,
  verifytokenandadmin,
} = require("./verifytoken");
const CryptoJS = require("crypto-js");

router.post("/", verifytokenandadmin, async (req, res) => {
  const newproduct = new product(req.body);
  try {
    const saveproduct = await newproduct.save();
    res.status(200).send(saveproduct);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", verifytokenandadmin, async (req, res) => {
  try {
    const updateproduct = await product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).send(updateproduct)
  } catch (err) {
    res.status(500).send(err)
  }
});

router.delete("/:id", verifytokenandadmin, (req, res) => {
  product
    .findByIdAndDelete(req.params.id)
    .then((re) => {
      res.status(200).send("product deleted");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get("/find/:id", verifytokenandadmin, (req, res) => {
  product
    .findById(req.params.id)
    .then((re) => {
      res.status(200).send(re);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get("/", async (req, res) => {
  const qnew = req.query.new;
  const qcategory=req.query.category
  try {
    let products;
    if(qnew){
      products=await product.find().sort({createdAt :-1}).limit(5)
    } else if(qcategory){
      products=await product.find({categories:{$in:[qcategory]}})
    }else{
      products=await product.find()
    }
    console.log(products)
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send(err);
  }
});
module.exports = router;
