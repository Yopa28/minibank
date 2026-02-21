const db = require("../database/db");

async function create(accountData) {
  const newAccount = {
    id: db.accountIdCounter,
    name: accountData.name,
    balance: accountData.balance,
    isFrozen: false,
    createdAt: accountData.createdAt
  };

  db.accounts.push(newAccount);
  db.accountIdCounter++;

  return newAccount;
}

async function findAll() {
  return db.accounts;
}

async function findById(id) {
  return db.accounts.find(acc => acc.id === id) || null;
}

async function update(updatedAccount) {
  const index = db.accounts.findIndex(acc => acc.id === updatedAccount.id);

  if (index !== -1) {
    db.accounts[index] = updatedAccount;
  }

  return updatedAccount;
}


module.exports = {
  create,
  findAll,
  findById,
  update,
};
