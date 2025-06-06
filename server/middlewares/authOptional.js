// server/middlewares/authOptional.js
const jwt = require("jsonwebtoken");

const authOptional = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      console.warn("Optional auth failed:", err.message);
    }
  }

  next();
};

module.exports = authOptional;
