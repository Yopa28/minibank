const bcrypt = require("bcrypt");
const pool = require("../config/database");

exports.register = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: "error",
        message: "Username and password required",
      });

      
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
    "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
    [username, hashedPassword, role || "user"]
    );

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
    });

  } catch (err) {

    if (err.code === "ER_DUP_ENTRY") {
    return res.status(400).json({
      status: "error",
      message: "Username already exists"
    });
  }
    next(err);
  }
};



const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      status: "success",
      token,
    });

  } catch (err) {
    next(err);
  }
};