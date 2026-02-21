const db = require("../database/db");

function create(auditData) {
  const newLog = {
    id: db.auditLogIdCounter,
    action: auditData.action,
    entity: auditData.entity,
    entityId: auditData.entityId,
    performedBy: auditData.performedBy,
    description: auditData.description,
    createdAt: new Date()
  };

  db.auditLogs.push(newLog);
  db.auditLogIdCounter++;

  return newLog;
}

function findAll() {
  return db.auditLogs;
}

module.exports = {
  create,
  findAll
};