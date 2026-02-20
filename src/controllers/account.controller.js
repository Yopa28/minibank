const accountService = require("../services/account.service");

async function createAccount(req, res, next) {
  try {
    const { name } = req.body;

    const account = accountService.createAccount(name);

    res.status(201).json(account);
  } catch (error) {
    next(error);
  }
}

async function getAccountById (req, res, next){
  try {
    const id = Number (req.params.id);

    const account = accountService.getAccountById(id);

    res.status (200).json (account);
  } catch (error){
    next (error);
  }
}

async function getAllAccounts (req, res, next) {
  try {
    const accounts = accountService.getAllAccounts();
    res.status (200).json(accounts);
  } catch (error){
    next(error);
  }
}

module.exports = {
  createAccount,
  getAccountById,
  getAllAccounts
};
