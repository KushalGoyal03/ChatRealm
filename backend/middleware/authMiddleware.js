const jwt = require("jsonwebtoken");

// Middleware to verify JWT and extract user ID
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for 'Bearer' format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing or invalid token format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // attach user ID to request
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = verifyToken;
