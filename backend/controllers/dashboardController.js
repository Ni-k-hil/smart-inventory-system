const db = require("../database/database");

const getDashboardSummary = (req, res) => {
  try {
    const totalProducts = db
      .prepare(
        `
            SELECT COUNT(*) AS count
            FROM products
        `,
      )
      .get().count;

    const totalStock = db
      .prepare(
        `
            SELECT COALESCE(SUM(quantity), 0) AS total
            FROM products
        `,
      )
      .get().total;

    const lowStockProducts = db
      .prepare(
        `
            SELECT COUNT(*) AS count
            FROM products
            WHERE quantity <= minimum_stock
        `,
      )
      .get().count;

    const outOfStockProducts = db
      .prepare(
        `
            SELECT COUNT(*) AS count
            FROM products
            WHERE quantity = 0
        `,
      )
      .get().count;

    const totalMovements = db
      .prepare(
        `
            SELECT COUNT(*) AS count
            FROM stock_movements
        `,
      )
      .get().count;

    const recentMovements = db
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
            LIMIT 10
        `,
      )
      .all();

    const lowStockItems = db
      .prepare(
        `
            SELECT
                id,
                name,
                sku,
                category,
                quantity,
                minimum_stock
            FROM products
            WHERE quantity <= minimum_stock
            ORDER BY quantity ASC
        `,
      )
      .all();

    res.json({
      statistics: {
        totalProducts,
        totalStock,
        lowStockProducts,
        outOfStockProducts,
        totalMovements,
      },
      recentMovements,
      lowStockItems,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch dashboard summary",
    });
  }
};

module.exports = {
  getDashboardSummary,
};
