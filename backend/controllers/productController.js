const db = require("../database/database");

const getProducts = (req, res) => {
  try {
    const products = db
      .prepare(
        `
            SELECT 
                products.*,
                warehouses.name AS warehouse_name
            FROM products
            LEFT JOIN warehouses 
                ON products.warehouse_id = warehouses.id
            ORDER BY products.id DESC
        `,
      )
      .all();

    res.json(products);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch products",
    });
  }
};

const getProductById = (req, res) => {
  try {
    const product = db
      .prepare(
        `
            SELECT 
                products.*,
                warehouses.name AS warehouse_name
            FROM products
            LEFT JOIN warehouses 
                ON products.warehouse_id = warehouses.id
            WHERE products.id = ?
        `,
      )
      .get(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch product",
    });
  }
};

const createProduct = (req, res) => {
  try {
    const {
      name,
      sku,
      category,
      quantity = 0,
      minimum_stock = 0,
      warehouse_id,
    } = req.body;

    if (!name || !sku || !category) {
      return res.status(400).json({
        error: "Name, SKU and category are required",
      });
    }

    if (quantity < 0 || minimum_stock < 0) {
      return res.status(400).json({
        error: "Quantity and minimum stock cannot be negative",
      });
    }

    const warehouse = warehouse_id
      ? db.prepare("SELECT id FROM warehouses WHERE id = ?").get(warehouse_id)
      : null;

    if (warehouse_id && !warehouse) {
      return res.status(400).json({
        error: "Warehouse not found",
      });
    }

    const existingProduct = db
      .prepare("SELECT id FROM products WHERE sku = ?")
      .get(sku);

    if (existingProduct) {
      return res.status(409).json({
        error: "SKU already exists",
      });
    }

    const result = db
      .prepare(
        `
            INSERT INTO products
            (name, sku, category, quantity, minimum_stock, warehouse_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `,
      )
      .run(name, sku, category, quantity, minimum_stock, warehouse_id || null);

    const product = db
      .prepare("SELECT * FROM products WHERE id = ?")
      .get(result.lastInsertRowid);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create product",
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
};
