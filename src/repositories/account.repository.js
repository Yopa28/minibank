const pool = require("../config/database");

async function create(accountData) {
  const { name, balance, isFrozen, createdAt } = accountData;

  const [result] = await pool.query(
    `
    INSERT INTO accounts (name, balance, isFrozen, createdAt)
    VALUES (?, ?, ?, ?)
    `,
    [name, balance, isFrozen, createdAt]
  );

  return {
    id: result.insertId,
    name,
    balance,
    isFrozen,
    createdAt
  };
}

async function findById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM accounts WHERE id = ?",
    [id]
  );

  return rows[0] || null;
}

async function findAll() {
  const [rows] = await pool.query(
    "SELECT * FROM accounts"
  );

  return rows;
}

async function update(account) {
  await pool.query(
    `
    UPDATE accounts
    SET name = ?, balance = ?, isFrozen = ?
    WHERE id = ?
    `,
    [account.name, account.balance, account.isFrozen, account.id]
  );

  return account;
}

module.exports = {
  create,
  findById,
  findAll,
  update
};