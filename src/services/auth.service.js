const pool = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const JWT_SECRET = process.env.JWT_SECRET;

async function register(username, password, role = "user") {
  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
    [username, hash, role]
  );

  return { message: "User registered" };
}

async function login(username, password) {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );

  const user = rows[0];
  if (!user) throw new AppError(401, "Invalid credentials");

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw new AppError(401, "Invalid credentials");

  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token };
}

module.exports = { register, login };