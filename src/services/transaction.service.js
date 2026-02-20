const accountRepository = require("../repositories/account.repository");
const transactionRepository = require("../repositories/transaction.repository");
const { validateAmount } = require("../validations/transaction.validation");
const { validateTransfer } = require("../validations/transaction.validation");

function deposit(accountId, amount) {
  validateAmount(amount);

  const account = accountRepository.findById(accountId);

  if (!account) {
    throw { statusCode: 404, message: "Account not found" };
  }

  account.balance += amount;

  accountRepository.update(account);

  transactionRepository.create({
    accountId: account.id,
    type: "deposit",
    amount,
    createdAt: new Date()
  });

  return account;
}


function withdraw (accountId, amount) {
  validateAmount(amount);
  
  const account = accountRepository.findById(accountId);

  if (!account){
    throw {statusCode: 404, message: "Account not found"};
  }

  if (account.balance < amount){
    throw {statusCode: 409, message: "Insufficient balance"};
  }

  account.balance -= amount;

  accountRepository.update(account);

  transactionRepository.create({
    accountId: account.id,
    type : "withdraw",
    amount, 
    createdAt: new Date () 
   });
   return account;
}


function transfer(fromId, toId, amount) {
  validateTransfer(fromId, toId, amount);

  const sender = accountRepository.findById(fromId);
  const receiver = accountRepository.findById(toId);

  if (!sender || !receiver) {
    throw { statusCode: 404, message: "Account not found" };
  }

  if (sender.balance < amount) {
    throw { statusCode: 409, message: "Insufficient balance" };
  }

  // Update balances
  sender.balance -= amount;
  receiver.balance += amount;

  accountRepository.update(sender);
  accountRepository.update(receiver);

  // Record transactions
  transactionRepository.create({
    accountId: sender.id,
    type: "transfer",
    amount,
    referenceId: receiver.id,
    createdAt: new Date()
  });

  transactionRepository.create({
    accountId: receiver.id,
    type: "transfer",
    amount,
    referenceId: sender.id,
    createdAt: new Date()
  });

  return { message: "Transfer successful" };
}

function getTranscationsByAccount(accountId) {
  const account = accountRepository.findById(accountId);

  if (!account) {
    throw { statusCode: 404, message: "Account not found" };
  }

  return transactionRepository.findByAccountId(accountId);
}




module.exports = {
  deposit,
  withdraw,
  transfer,
  getTranscationsByAccount
};

