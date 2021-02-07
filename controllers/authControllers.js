const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const maxAge = 3 * 24 * 60 * 60;

function handleAuthErrors(err) {
  let errors = { email: "", password: "" };

  if (err.code === 11000) {
    errors.email = "Taki użytkownik już istnieje";
    return errors;
  }

  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).map(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

function createToken(id) {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: maxAge,
  });
}

module.exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge });
    res.status(201).json({ token, user: user._id });
  } catch (err) {
    const errors = handleAuthErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.userLogin(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ token, user: user._id });
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.validToken = async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.SECRET);
    if (!verified) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports.user = async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    id: user._id,
    email: user.email,
  });
};
