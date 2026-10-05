const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "inventory.db");
const schemaPath = path.join(__dirname, "schema.sql");

const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

const schema = fs.readFileSync(schemaPath, "utf8");
db.exec(schema);

const stockMovementColumns = db
  .prepare("PRAGMA table_info(stock_movements)")
  .all();

const hasWarehouseId = stockMovementColumns.some(
  (column) => column.name === "warehouse_id",
);

if (!hasWarehouseId) {
  db.exec(`
    ALTER TABLE stock_movements
    ADD COLUMN warehouse_id INTEGER
  `);
}

console.log("SQLite database connected");
console.log("Database tables initialized");

module.exports = db;
