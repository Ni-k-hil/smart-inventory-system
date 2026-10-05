const db = require("../database/database");

const getWarehouses = (req, res) => {
  try {
    const warehouses = db
      .prepare(
        `
            SELECT
                warehouses.*,
                COUNT(products.id) AS product_count,
                COALESCE(SUM(products.quantity), 0) AS total_stock
            FROM warehouses
            LEFT JOIN products
                ON warehouses.id = products.warehouse_id
            GROUP BY warehouses.id
            ORDER BY warehouses.id DESC
        `,
      )
      .all();

    res.json(warehouses);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch warehouses",
    });
  }
};

const createWarehouse = (req, res) => {
  try {
    const { name, location, capacity = 0 } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        error: "Warehouse name and location are required",
      });
    }

    if (!Number.isInteger(Number(capacity)) || Number(capacity) < 0) {
      return res.status(400).json({
        error: "Capacity must be a non-negative integer",
      });
    }

    const result = db
      .prepare(
        `
            INSERT INTO warehouses
            (name, location, capacity)
            VALUES (?, ?, ?)
        `,
      )
      .run(name, location, Number(capacity));

    const warehouse = db
      .prepare("SELECT * FROM warehouses WHERE id = ?")
      .get(result.lastInsertRowid);

    res.status(201).json({
      message: "Warehouse created successfully",
      warehouse,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create warehouse",
    });
  }
};

module.exports = {
  getWarehouses,
  createWarehouse,
};
