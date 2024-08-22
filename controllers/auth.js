const { response } = require("express");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/UserModel");
const { generateJWT } = require("../helpers/jwt");

const createUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).json({
        ok: false,
        name: "The email is registered by another user.",
      });
    }

    user = new UserModel(req.body);

    // Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);
    await user.save();

    res.status(201).json({
      ok: true,
      name: user.name,
      email: user.email,
      password: user.password,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: true, msg: "Try in 5 minutes please" });
  }
};

const userLogin = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await UserModel.findOne({ email });
    if (!user)
      return res.status(400).json({
        ok: false,
        msg: "User or password is not correct",
      });

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword)
      return res.status(400).json({
        ok: false,
        msg: "Password is invalid",
      });

    // Generate JWT
    const token = await generateJWT(user._id, user.name);

    res.json({
      ok: true,
      msg: "Loged",
      uid: user._id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: true, msg: "Try in 5 minutes please" });
  }
};

const validateToken = async (req, res = response) => {
  const { uid, name } = req;

  const token = await generateJWT(uid, name);
  res.json({
    ok: true,
    uid,
    name,
    token,
  });
};

module.exports = {
  createUser,
  userLogin,
  validateToken,
};
