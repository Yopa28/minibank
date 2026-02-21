const express = require("express");
const router = express.Router();
const accountController = require("../controllers/account.controller");
const requireRole = require("../middlewares/role.middleware");

router.post("/accounts", accountController.createAccount);
router.get ("/accounts", accountController.getAllAccounts)
router.get ("/accounts/:id", accountController.getAccountById);
router.patch(  "/accounts/:id/freeze", requireRole("admin"), accountController.freezeAccount);
router.patch("/accounts/:id/unfreeze", accountController.unfreezeAccount);
module.exports = router;
