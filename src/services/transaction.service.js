const accountRepository = require("../repositories/account.repository");
const transactionRepository = require("../repositories/transaction.repository");
const { validateAmount } = require("../validations/transaction.validation");
const { validateTransfer } = require("../validations/transaction.validation");
const auditRepository = require("../repositories/audit.repository");


const AppError = require("../utils/AppError");

async function deposit(accountId, amount, performedBy) {
  validateAmount(amount);

  const account = await accountRepository.findById(accountId);

  if (!account) {
    throw new AppError(404, "Account not found");
  }

  if (account.isFrozen) {
    throw new AppError(403, "Account is frozen");
  }

  account.balance += amount;

  await accountRepository.update(account);

  await transactionRepository.create({
    accountId: account.id,
    type: "deposit",
    amount,
    createdAt: new Date()
  });

  await auditRepository.create({
    action: "DEPOSIT",
    entity: "Account",
    entityId: account.id,
    performedBy,
    description: `Deposit ${amount} to account ${account.id}`,
    createdAt: new Date()
  });

  return account;
}

async function withdraw (accountId, amount, performedBy) {
  validateAmount(amount);
  
  const account = await accountRepository.findById(accountId);

    if (!account) {
    throw new AppError(404, "Account not found");
  }

    if (account.isFrozen) {
    throw new AppError(403, "Account is frozen");
  }

  if (account.balance < amount){
    throw new AppError ( 409, "Insufficient balance");
  }

  account.balance -= amount;

  accountRepository.update(account);

  transactionRepository.create({
    accountId: account.id,
    type : "withdraw",
    amount, 
    createdAt: new Date () 
   });

   auditRepository.create({
    action: "WITHDRAW",
    entity: "Account",
    entityId: account.id, performedBy,
    description: `Withdraw ${amount} from account ${account.id}`,
  });

   return account;
}


async function transfer(fromId, toId, amount, performedBy) {
  validateTransfer(fromId, toId, amount, performedBy);

  const sender = await accountRepository.findById(fromId);
  const receiver = await accountRepository.findById(toId);

  if (!sender || !receiver) {
    throw new AppError  ( 404,  "Account not found" );
  }

  if (sender.isFrozen) {
    throw new AppError ( 403,  "Sender account is frozen" );
  }

  if (receiver.isFrozen) {
    throw new AppError ( 403,  "Receiver account is frozen" );
  }

  if (sender.balance < amount) {
    throw new AppError ( 409,  "Insufficient balance" );
  }

  // Update balances
  sender.balance -= amount;
  receiver.balance += amount;

  accountRepository.update(sender);
  accountRepository.update(receiver);

  // Record transactions (keluar)
  transactionRepository.create({
    accountId: sender.id,
    type: "transfer_out",
    amount,
    referenceId: receiver.id,
    createdAt: new Date()
  });

  // Record transactions (masuk)
  transactionRepository.create({
    accountId: receiver.id,
    type: "transfer_in",
    amount,
    referenceId: sender.id,
    createdAt: new Date()
  });

  auditRepository.create({
    action: "TRANSFER",
    entity: "Account",
    entityId: sender.id,performedBy,
    description: `Transfer ${amount} from ${sender.id} to ${receiver.id}`,
  });

  return { message: "Transfer successful" };
}



async function getTransactionsByAccount(accountId) {
  const account = await accountRepository.findById(accountId);

  if (!account) {
    throw { statusCode: 404, message: "Account not found" };
  }

  return transactionRepository.findByAccountId(accountId);
}




module.exports = {
  deposit,
  withdraw,
  transfer,
  getTransactionsByAccount
};

