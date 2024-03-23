const User = require("../models/user.model");
const hash = require("../helpers/hashing");

const normalHash = (words) => {
  const charSet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  let length = 8;
  let word = words;
  if (word.length > 4) {
    word = word.slice(0, 4);
  }
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    password += charSet[randomIndex];
  }
  password = word + password;
  return password;
};

const mediumHash = (words) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_";
  let password = "";
  let length = 10;
  let word = words;
  if (word.length > 4) {
    word = word.slice(0, 4);
  }
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  password = word + password;
  return password;
};

const strongHash = (words) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_";
  let password = "";
  const length = 12;
  let word = words;
  if (word.length > 4) {
    word = word.slice(0, 4);
  }
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  password = word + password;
  return password;
};

const userRegistration = async (req, res) => {
  try {
    const { email, password } = req.body;
    const exist = await User.findOne({ Email: email });
    if (exist) {
      res.send({ status: 500, success: false, message: "user already exist" });
    } else {
      const pass = await hash.encrypt(password);
      console.log(pass,'pass');
      const user = new User({
        Email: email,
        Password: pass,        
      });
      let saved = user.save();
      if (saved) {
        res.send({ status: 200, success: true, message: "user created" });
      } else {
        res.send({
          status: 500,
          success: false,
          message: "user creation failed",
        });
      }
    }
  } catch (error) {
    res.send({ status: 500, success: false, message: error });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ Email: email });
    if (user) {
      const pass = hash.decrypt(password, user.Password);
      if (pass) {
        res.send({
          status: 200,
          success: true,
          userEmail: user.Email,
          message: "User Login successful",
        });
      } else {
        res.send({
          status: 500,
          success: false,
          message: "Password is incorrect",
        });
      }
    } else {
      res.send({ status: 500, success: false, message: "User not found" });
    }
  } catch (error) {
    res.send({ status: 500, success: false, message: error });
  }
};

const getPasswords = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ Email: email });
    if (user) {
      res.send({
        status: 200,
        success: true,
        passwords: user.Pass,
        message: "Data fetched successfully",
      });
    } else {
      res.send({ status: 500, success: false, message: "user not found" });
    }
  } catch (error) {
    res.send({ status: 500, success: false, message: error });
  }
};

const generatePass = async (req, res) => {
  try {
    const { email, intensity, words, date } = req.body;

    let pass;

    if (intensity === "normal") {
      pass = normalHash(words);
    } else if (intensity === "medium") {
      pass = mediumHash(words);
    } else {
      pass = strongHash(words);
    }

    let data = {
      password: pass,
      date: date,
    };

    const user = await User.findOneAndUpdate(
      { Email: email },
      {
        $push: {
          Pass: data,
        },
      },
      { new: true }
    );

    if (user) {
      res.send({
        status: 200,
        success: true,
        message: "new Password generated",
      });
    } else {
      res.send({
        status: 500,
        success: false,
        message: "password generation failed",
      });
    }
  } catch (error) {
    res.send({ status: 500, success: false, message: error });
  }
};

module.exports = {
  userRegistration,
  userLogin,
  getPasswords,
  generatePass,
};
