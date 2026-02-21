const accountService = require("../services/account.service");

async function createAccount(req, res, next) {
  try {
    const { name } = req.body;
    const performedBy = req.user.id;

    const account = await accountService.createAccount(
      name,
      performedBy
    );

    res.status(201).json(account);
  } catch (error) {
    next(error);
  }
}

async function getAccountById(req, res, next) {
  try {
    const id = Number(req.params.id);

    const account = await accountService.getAccountById(id);

    res.status(200).json(account);
  } catch (error) {
    next(error);
  }
}

async function getAllAccounts(req, res, next) {
  try {
    const accounts = await accountService.getAllAccounts();

    res.status(200).json(accounts);
  } catch (error) {
    next(error);
  }
}

async function freezeAccount(req, res, next) {
  try {
    const id = Number(req.params.id);
    const performedBy = req.user.id;

    const account = await accountService.freezeAccount(
      id,
      performedBy
    );

    res.status(200).json({
      message: "Account frozen",
      account
    });
  } catch (error) {
    next(error);
  }
}

async function unfreezeAccount(req, res, next) {
  try {
    const id = Number(req.params.id);
    const performedBy = req.user.id;

    const account = await accountService.unfreezeAccount(
      id,
      performedBy
    );

    res.status(200).json({
      message: "Account unfrozen",
      account
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createAccount,
  getAccountById,
  getAllAccounts,
  freezeAccount,
  unfreezeAccount
};