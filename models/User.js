const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "To pole jest wymagane"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Wprowadź poprawny email"],
  },
  password: {
    type: String,
    required: [true, "To pole jest wymagane"],
    minlength: [7, "Hasło musi mieć minimum 7 znaków"],
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
        passwordError.notEmpty = "To pole jest wymagane";
      } else {
        passwordError.invalid = "Błędne hasło";
      }
    }
  } else {
    if (email === "") {
      emailError.notEmpty = "To pole jest wymagane";
    } else if (!isEmail(email)) {
      emailError.invalid = "Błędny email";
    } else {
      emailError.notExist = "Taki użytkownik nie istnieje";
    }
  }

  throw loginError;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
