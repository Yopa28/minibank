const pool = require("../config/database");
const AppError = require("../utils/AppError");
const { validateAmount } = require("../validations/transaction.validation");

/**
 * Helper untuk menjalankan operasi dalam DB transaction
 */
async function runInTransaction(callback) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const result = await callback(connection);

    await connection.commit();
    return result;

  } catch (error) {
    await connection.rollback();
    throw error;

  } finally {
    connection.release();
  }
}

/**
 * DEPOSIT
 */
async function deposit(accountId, amount, performedBy) {
  validateAmount(amount);

  return runInTransaction(async (conn) => {

    const [rows] = await conn.query(
      "SELECT * FROM accounts WHERE id = ? FOR UPDATE",
      [accountId]
    );

    const account = rows[0];

    if (!account) {
      throw new AppError(404, "Account not found");
    }

    if (account.isFrozen) {
      throw new AppError(403, "Account is frozen");
    }

    // Update balance
    await conn.query(
      "UPDATE accounts SET balance = balance + ? WHERE id = ?",
      [amount, accountId]
    );

    // Insert transaction record
    await conn.query(
      `
      INSERT INTO transactions (accountId, type, amount, referenceId)
      VALUES (?, 'deposit', ?, NULL)
      `,
      [accountId, amount]
    );

    // Insert audit log
    await conn.query(
      `
      INSERT INTO audit_logs (action, entity, entityId, performedBy, description)
      VALUES ('DEPOSIT', 'Account', ?, ?, ?)
      `,
      [accountId, performedBy, `Deposit ${amount} to account ${accountId}`]
    );

    return {
      ...account,
      balance: Number(account.balance) + Number(amount)
    };
  });
}

/**
 * WITHDRAW
 */
async function withdraw(accountId, amount, performedBy) {
  validateAmount(amount);

  return runInTransaction(async (conn) => {

    const [rows] = await conn.query(
      "SELECT * FROM accounts WHERE id = ? FOR UPDATE",
      [accountId]
    );

    const account = rows[0];

    if (!account) {
      throw new AppError(404, "Account not found");
    }

    if (account.isFrozen) {
      throw new AppError(403, "Account is frozen");
    }

    if (Number(account.balance) < Number(amount)) {
      throw new AppError(409, "Insufficient balance");
    }

    // Update balance
    await conn.query(
      "UPDATE accounts SET balance = balance - ? WHERE id = ?",
      [amount, accountId]
    );

    // Insert transaction record
    await conn.query(
      `
      INSERT INTO transactions (accountId, type, amount, referenceId)
      VALUES (?, 'withdraw', ?, NULL)
      `,
      [accountId, amount]
    );

    // Insert audit log
    await conn.query(
      `
      INSERT INTO audit_logs (action, entity, entityId, performedBy, description)
      VALUES ('WITHDRAW', 'Account', ?, ?, ?)
      `,
      [accountId, performedBy, `Withdraw ${amount} from account ${accountId}`]
    );

    return {
      ...account,
      balance: Number(account.balance) - Number(amount)
    };
  });
}

/**
 * TRANSFER
 */
async function transfer(fromId, toId, amount, performedBy) {
  validateAmount(amount);

  if (fromId === toId) {
    throw new AppError(400, "Cannot transfer to the same account");
  }

  return runInTransaction(async (conn) => {

    // Lock sender
    const [senderRows] = await conn.query(
      "SELECT * FROM accounts WHERE id = ? FOR UPDATE",
      [fromId]
    );

    const sender = senderRows[0];

    if (!sender) {
      throw new AppError(404, "Sender account not found");
    }

    if (sender.isFrozen) {
      throw new AppError(403, "Sender account is frozen");
    }

    if (Number(sender.balance) < Number(amount)) {
      throw new AppError(409, "Insufficient balance");
    }

    // Lock receiver
    const [receiverRows] = await conn.query(
      "SELECT * FROM accounts WHERE id = ? FOR UPDATE",
      [toId]
    );

    const receiver = receiverRows[0];

    if (!receiver) {
      throw new AppError(404, "Receiver account not found");
    }

    // Update balances
    await conn.query(
      "UPDATE accounts SET balance = balance - ? WHERE id = ?",
      [amount, fromId]
    );

    await conn.query(
      "UPDATE accounts SET balance = balance + ? WHERE id = ?",
      [amount, toId]
    );

    // Insert transaction records
    await conn.query(
      `
      INSERT INTO transactions (accountId, type, amount, referenceId)
      VALUES (?, 'transfer', ?, ?)
      `,
      [fromId, amount, toId]
    );

    await conn.query(
      `
      INSERT INTO transactions (accountId, type, amount, referenceId)
      VALUES (?, 'transfer', ?, ?)
      `,
      [toId, amount, fromId]
    );

    // Insert audit log
    await conn.query(
      `
      INSERT INTO audit_logs (action, entity, entityId, performedBy, description)
      VALUES ('TRANSFER', 'Account', ?, ?, ?)
      `,
      [fromId, performedBy, `Transfer ${amount} from ${fromId} to ${toId}`]
    );

    return { message: "Transfer successful" };
  });
}

/**
 * GET TRANSACTIONS BY ACCOUNT
 */

async function getTransactionsByAccount(accountId) {
  const [rows] = await pool.query(
    "SELECT * FROM transactions WHERE accountId = ? ORDER BY createdAt DESC",
    [accountId]
  );

  return rows;
}

module.exports = {
  deposit,
  withdraw,
  transfer,
  getTransactionsByAccount
};