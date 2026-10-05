const db = require("../database/database");

const getSuppliers = (req, res) => {
  try {
    const suppliers = db
      .prepare(
        `
            SELECT *
            FROM suppliers
            ORDER BY id DESC
        `,
      )
      .all();

    res.json(suppliers);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch suppliers",
    });
  }
};

const createSupplier = (req, res) => {
  try {
    const { name, phone, email, address } = req.body;

    if (!name) {
      return res.status(400).json({
        error: "Supplier name is required",
      });
    }

    const result = db
      .prepare(
        `
            INSERT INTO suppliers
            (name, phone, email, address)
            VALUES (?, ?, ?, ?)
        `,
      )
      .run(name, phone || null, email || null, address || null);

    const supplier = db
      .prepare("SELECT * FROM suppliers WHERE id = ?")
      .get(result.lastInsertRowid);

    res.status(201).json({
      message: "Supplier created successfully",
      supplier,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create supplier",
    });
  }
};

module.exports = {
  getSuppliers,
  createSupplier,
};
