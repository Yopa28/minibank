const express = require("express");
const router = express.Router();
const auditRepository = require("../repositories/audit.repository");

router.get("/audit-logs", (req, res) => {
  res.json(auditRepository.findAll());
});

module.exports = router;