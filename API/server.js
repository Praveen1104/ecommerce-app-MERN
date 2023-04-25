const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv=require("dotenv");
const userRoute=require("./routes/User")
const authrouter=require('./routes/Auth')
const productRoute=require('./routes/Product')
const cartroute=require('./routes/Cart')
const orderroute=require('./routes/Order')
const paymentroute=require('./routes/Stripe')
const cors=require("cors")
dotenv.config()
mongoose
  .connect(
    process.env.MONGO_URL
  )
  .then(() => {
    console.log("connected");
  }).catch((err)=>{
    console.log("backen--",err)
  })
  app.use(cors())
  app.use(express.json())
 app.get("/",(req,res)=>{
  res.send("hiiii")
 })
  app.use("/api/user",userRoute)
  app.use("/api/auth",authrouter)
  app.use("/api/product",productRoute)
  app.use("/api/cart",cartroute)
  app.use("/api/order",orderroute)
  app.use("/api/checkout",paymentroute)
app.listen(process.env.PORT || 5000 , () => {
  console.log("backend server is running");
});
