const { addStock, removeStock } = require("../services/stockService");

const stockIn = (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    if (!product_id || quantity === undefined) {
      return res.status(400).json({
        error: "Product ID and quantity are required",
      });
    }

    const result = addStock(Number(product_id), Number(quantity));

    res.status(200).json({
      message: "Stock added successfully",
      result,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const stockOut = (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    if (!product_id || quantity === undefined) {
      return res.status(400).json({
        error: "Product ID and quantity are required",
      });
    }

    const result = removeStock(Number(product_id), Number(quantity));

    res.status(200).json({
      message: "Stock removed successfully",
      result,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const getStockMovements = (req, res) => {
  try {
    const movements = require("../database/database")
      .prepare(
        `
                SELECT
                    stock_movements.*,
                    products.name AS product_name,
                    products.sku
                FROM stock_movements
                JOIN products
                    ON stock_movements.product_id = products.id
                ORDER BY stock_movements.id DESC
            `,
      )
      .all();

    res.json(movements);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch stock movements",
    });
  }
};

module.exports = {
  stockIn,
  stockOut,
  getStockMovements,
};
