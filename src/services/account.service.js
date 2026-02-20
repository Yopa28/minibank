const accountRepository = require("../repositories/account.repository");
const { validateCreateAccount } = require("../validations/account.validation");

function createAccount(name) {
  validateCreateAccount(name);

  const accountData = {
    name,
    balance: 0,
    createdAt: new Date()
  };

  return accountRepository.create(accountData);
}

function getAccountById(id) {
  const account = accountRepository.findById(id);

  if (!account) {
    throw { statusCode: 404, message: "Account not found" };
  }

  return account;
}

function getAllAccounts(){
  return accountRepository.findAll();
}


module.exports = {
  createAccount,
  getAccountById,
  getAllAccounts
};

