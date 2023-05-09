const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../model/user.model");

const userRouter = Router();

// Register
userRouter.post("/signup", async (req, res) => {
  const { email, password, confirmpassword } = req.body;

  try {
    if (password === confirmpassword) {
      bcrypt.hash(password, 5, async (err, hash) => {
        const user = new UserModel({
          email,
          password: hash,
          confirmpassword: hash,
        });
        await user.save();
        res.status(201).send({ message: "User Successfully registered" });
      });
    } else {
      res.status(400).send({ message: "password must be same" });
    }
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

// Login
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });
    console.log(user);
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          res.status(200).send({
            message: "Login Successfull",
            token: jwt.sign({ userId: user._id }, "masai"),
          });
        } else {
          res.status(400).send({ message: "Invalid Credentials" });
        }
      });
    } else {
      res.status(400).send({ message: "User not Found,plz Register " });
    }
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

module.exports = { userRouter };
