const pool = require("../config/database");

async function create(auditData) {
  const { action, entity, entityId, performedBy, description } = auditData;

  const [result] = await pool.query(
    `
    INSERT INTO audit_logs (action, entity, entityId, performedBy, description)
    VALUES (?, ?, ?, ?, ?)
    `,
    [action, entity, entityId, performedBy, description]
  );

  return {
    id: result.insertId,
    action,
    entity,
    entityId,
    performedBy,
    description
  };
}

async function findAll() {
  const [rows] = await pool.query(
    "SELECT * FROM audit_logs ORDER BY createdAt DESC"
  );

  return rows;
}

module.exports = {
  create,
  findAll
};