const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);

// dummy register
router.post("/register", (req, res) => {
  res.json({
    status: "success",
    message: "Register endpoint works",
  });
});

// dummy login
router.post("/login", (req, res) => {
  res.json({
    status: "success",
    message: "Login endpoint works",
  });
});

module.exports = router;