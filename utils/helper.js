const jwt = require("jsonwebtoken");


const generateShortId = async (len) => {
  const { nanoid } = await import("nanoid");
  return nanoid(len);
};

const generateToken = (payload, expiresIn = "1h") => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};


module.exports = { generateShortId, generateToken };
