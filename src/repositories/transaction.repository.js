const db = require("../database/db");

function create(transactionData) {
  const newTransaction = {
    id: db.transactionIdCounter,
    accountId: transactionData.accountId,
    type: transactionData.type,
    amount: transactionData.amount,
    referenceId: transactionData.referenceId || null,
    createdAt: transactionData.createdAt
  };

  db.transactions.push(newTransaction);
  db.transactionIdCounter++;

  return newTransaction;
}

function findByAccountId(accountId){
    return db.transactions.filter(
        tx => tx.accountId === accountId
    );
}


module.exports = {
  create,
  findByAccountId
};
