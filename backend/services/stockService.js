const db = require("../database/database");

const addStock = (productId, quantity) => {
  const transaction = db.transaction(() => {
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
      .get(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    const stockQuantity = Number(quantity);

    if (stockQuantity <= 0 || !Number.isInteger(stockQuantity)) {
      throw new Error("Quantity must be a positive whole number");
    }

    const previousQuantity = product.quantity;
    const newQuantity = previousQuantity + stockQuantity;

    db.prepare(
      `
      UPDATE products
      SET quantity = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    ).run(newQuantity, productId);

    db.prepare(
      `
      INSERT INTO stock_movements
      (
        product_id,
        warehouse_id,
        type,
        quantity,
        previous_quantity,
        new_quantity
      )
      VALUES (?, ?, 'IN', ?, ?, ?)
    `,
    ).run(
      productId,
      product.warehouse_id,
      stockQuantity,
      previousQuantity,
      newQuantity,
    );

    db.prepare(
      `
      INSERT INTO inventory_logs
      (
        action,
        product_id,
        quantity,
        details
      )
      VALUES (?, ?, ?, ?)
    `,
    ).run(
      "STOCK_IN",
      productId,
      stockQuantity,
      `Stock added to ${product.warehouse_name || "warehouse"}`,
    );

    return {
      productId,
      warehouseId: product.warehouse_id,
      warehouseName: product.warehouse_name,
      previousQuantity,
      newQuantity,
    };
  });

  return transaction();
};

const removeStock = (productId, quantity) => {
  const transaction = db.transaction(() => {
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
      .get(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    const stockQuantity = Number(quantity);

    if (stockQuantity <= 0 || !Number.isInteger(stockQuantity)) {
      throw new Error("Quantity must be a positive whole number");
    }

    if (stockQuantity > product.quantity) {
      throw new Error(
        `Insufficient stock. Available stock: ${product.quantity}`,
      );
    }

    const previousQuantity = product.quantity;
    const newQuantity = previousQuantity - stockQuantity;

    db.prepare(
      `
      UPDATE products
      SET quantity = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    ).run(newQuantity, productId);

    db.prepare(
      `
      INSERT INTO stock_movements
      (
        product_id,
        warehouse_id,
        type,
        quantity,
        previous_quantity,
        new_quantity
      )
      VALUES (?, ?, 'OUT', ?, ?, ?)
    `,
    ).run(
      productId,
      product.warehouse_id,
      stockQuantity,
      previousQuantity,
      newQuantity,
    );

    db.prepare(
      `
      INSERT INTO inventory_logs
      (
        action,
        product_id,
        quantity,
        details
      )
      VALUES (?, ?, ?, ?)
    `,
    ).run(
      "STOCK_OUT",
      productId,
      stockQuantity,
      `Stock removed from ${product.warehouse_name || "warehouse"}`,
    );

    return {
      productId,
      warehouseId: product.warehouse_id,
      warehouseName: product.warehouse_name,
      previousQuantity,
      newQuantity,
    };
  });

  return transaction();
};

module.exports = {
  addStock,
  removeStock,
};
