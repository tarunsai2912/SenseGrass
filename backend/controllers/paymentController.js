const Razorpay = require("razorpay");
const Payment = require("../model/payment");
const User = require("../model/user");
const crypto = require("crypto");
const dotenv = require('dotenv');
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

const makePayment = async (req, res, next) => {
  try {
    const user = await User.findById(req.user_Id);
    if (!user) {
      return res.status(400).json({ message: 'User Not Found' });
    }

		const options = {
			amount: req.body.amount * 100,
			currency: "INR",
			receipt: crypto.randomBytes(10).toString("hex"),
		};

    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).json({ message: "Something Went Wrong!" });
    }
    const newPayment = new Payment({ amount: order.amount, transactionId: order.id, status: 'paid', userId: user._id });
    await newPayment.save();
    user.pro = true
    user.proActivationDate = Date.now()
    await user.save()
    return res.status(200).json(order);
  } 
  catch (err) {
    return next(err)
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(sign.toString())
      .digest("hex");
    
    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } 
    else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } 
  catch (err) {
    return next(err)
  }
};

module.exports = { makePayment, verifyPayment };
