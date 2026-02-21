const express = require("express");
const router = express.Router();
const auditRepository = require("../repositories/audit.repository");

router.get("/audit-logs", async (req, res) => {
  const logs = await auditRepository.findAll();
  res.json(logs);
});


module.exports = router;