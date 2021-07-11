const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "This field is required"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please type a valid email"],
  },
  password: {
    type: String,
    required: [true, "This field is required"],
    minlength: [7, "Password must be greater than 7 characters"],
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.userLogin = async function (email, password) {
  const loginError = {
    emailError: {
      notEmpty: "",
      invalid: "",
      notExist: "",
    },
    passwordError: {
      notEmpty: "",
      invalid: "",
    },
  };

  const { emailError, passwordError } = loginError;

  const user = await this.findOne({ email });

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user;
    } else {
      if (password === "") {
        passwordError.notEmpty = "This field is required";
      } else {
        passwordError.invalid = "Invalid password";
      }
    }
  } else {
    if (email === "") {
      emailError.notEmpty = "This field is required";
    } else if (!isEmail(email)) {
      emailError.invalid = "Invalid email";
    } else {
      emailError.notExist = "User with this login does not exist";
    }
  }

  throw loginError;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
