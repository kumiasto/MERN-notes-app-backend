//PROTECTED ROUTE
const jwt = require("jsonwebtoken");

function authUser(req, res, next) {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(401).json({ message: "Brak autoryzacji" });
    }

    const verifiedToken = jwt.verify(token, process.env.SECRET);
    if (!verifiedToken) {
      return res.status(401).json({ message: "Bledny token" });
    }

    req.user = verifiedToken.id;
    next();
  } catch (err) {
    res.status(400).json({ error: "Błędne dane" });
  }
}

module.exports = authUser;
