const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");

router.post("/accounts/:id/deposit", transactionController.deposit);
router.post("/accounts/:id/withdraw", transactionController.withdraw);
router.post("/transfer", transactionController.transfer);
router.get("/accounts/:id/transactions",transactionController.getTransactions);


module.exports = router;
