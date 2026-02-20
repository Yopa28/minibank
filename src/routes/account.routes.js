const express = require("express");
const router = express.Router();
const accountController = require("../controllers/account.controller");

router.post("/accounts", accountController.createAccount);
router.get ("/accounts", accountController.getAllAccounts)
router.get ("/accounts/:id", accountController.getAccountById);


module.exports = router;
