const pool = require("../config/database");

async function create(transactionData) {
  const { accountId, type, amount, referenceId, createdAt } = transactionData;

  const [result] = await pool.query(
    `
    INSERT INTO transactions (accountId, type, amount, referenceId, createdAt)
    VALUES (?, ?, ?, ?, ?)
    `,
    [accountId, type, amount, referenceId, createdAt]
  );

  return {
    id: result.insertId,
    accountId,
    type,
    amount,
    referenceId,
    createdAt
  };
}

async function findByAccountId(accountId) {
  const [rows] = await pool.query(
    `
    SELECT * FROM transactions
    WHERE accountId = ?
    ORDER BY createdAt DESC
    `,
    [accountId]
  );

  return rows;
}

module.exports = {
  create,
  findByAccountId
};