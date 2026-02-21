const accountRepository = require("../repositories/account.repository");
const { validateCreateAccount } = require("../validations/account.validation");
const auditRepository = require("../repositories/audit.repository");
const AppError = require("../utils/AppError");

async function createAccount(name, performedBy) {
  validateCreateAccount(name);

  const accountData = {
    name,
    balance: 0,
    isFrozen: false,
    createdAt: new Date()
  };

  const account = await accountRepository.create(accountData);

  await auditRepository.create({
    action: "CREATE_ACCOUNT",
    entity: "Account",
    entityId: account.id,
    description: `Account created for ${account.name}`,
    performedBy,
    createdAt: new Date()
  });

  return account;
}


async function getAccountById(id) {
  const account = await accountRepository.findById(id);

  if (!account) {
    throw { statusCode: 404, message: "Account not found" };
  }

  return account;
}


async function getAllAccounts() {
  return accountRepository.findAll();
}


async function freezeAccount(id) {
  const account = await accountRepository.findById(id);

  if (!account) {
    throw new AppError ( 404, "Account not found" );
  }

  if (account.isFrozen) {
    throw new AppError ( 409,  "Account already frozen" );
  }

  account.isFrozen = true;

  await accountRepository.update(account);

  await auditRepository.create({
    action: "FREEZE_ACCOUNT",
    entity: "Account",
    entityId: account.id,
    description: `Account ${account.id} frozen`,
    createdAt: new Date()
  });

  return account;
}

async function unfreezeAccount(id) {
  const account = await accountRepository.findById(id);

  if (!account) {
    throw new AppError ( 404,  "Account not found" );
  }

  if (!account.isFrozen) {
    throw new AppError ( 409, "Account is not frozen" );
  }

  account.isFrozen = false;

  await accountRepository.update(account);

  await auditRepository.create({
    action: "UNFREEZE_ACCOUNT",
    entity: "Account",
    entityId: account.id,
    description: `Account ${account.id} unfrozen`,
    createdAt: new Date()
  });

  return account;
}

module.exports = {
  createAccount,
  getAccountById,
  getAllAccounts,
  freezeAccount,
  unfreezeAccount
};

