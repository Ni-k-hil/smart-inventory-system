const db = require("../database/database");

const getPurchaseOrders = (req, res) => {
  try {
    const orders = db
      .prepare(
        `
        SELECT
          purchase_orders.*,
          suppliers.name AS supplier_name,
          products.name AS product_name,
          products.sku
        FROM purchase_orders
        JOIN suppliers ON suppliers.id = purchase_orders.supplier_id
        JOIN products ON products.id = purchase_orders.product_id
        ORDER BY purchase_orders.id DESC
      `,
      )
      .all();

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch purchase orders",
    });
  }
};

const createPurchaseOrder = (req, res) => {
  try {
    const { supplier_id, product_id, quantity } = req.body;

    if (
      !supplier_id ||
      !product_id ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) <= 0
    ) {
      return res.status(400).json({
        message: "Valid supplier, product and positive quantity are required",
      });
    }

    const supplier = db
      .prepare("SELECT id FROM suppliers WHERE id = ?")
      .get(supplier_id);

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    const product = db
      .prepare("SELECT id FROM products WHERE id = ?")
      .get(product_id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const result = db
      .prepare(
        `
        INSERT INTO purchase_orders
        (supplier_id, product_id, quantity)
        VALUES (?, ?, ?)
      `,
      )
      .run(supplier_id, product_id, Number(quantity));

    const order = db
      .prepare(
        `
        SELECT
          purchase_orders.*,
          suppliers.name AS supplier_name,
          products.name AS product_name,
          products.sku
        FROM purchase_orders
        JOIN suppliers ON suppliers.id = purchase_orders.supplier_id
        JOIN products ON products.id = purchase_orders.product_id
        WHERE purchase_orders.id = ?
      `,
      )
      .get(result.lastInsertRowid);

    res.status(201).json({
      message: "Purchase order created successfully",
      purchaseOrder: order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create purchase order",
    });
  }
};

const updatePurchaseOrderStatus = (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Received", "Cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid purchase order status",
      });
    }

    const existingOrder = db
      .prepare("SELECT * FROM purchase_orders WHERE id = ?")
      .get(orderId);

    if (!existingOrder) {
      return res.status(404).json({
        message: "Purchase order not found",
      });
    }

    // No change
    if (existingOrder.status === status) {
      return res.json({
        message: "Purchase order status unchanged",
      });
    }

    // Only Pending orders can be changed
    if (existingOrder.status !== "Pending") {
      return res.status(400).json({
        message: "Only Pending purchase orders can be updated",
      });
    }

    if (status === "Received") {
      const receiveOrder = db.transaction(() => {
        const product = db
          .prepare(
            `
            SELECT quantity
            FROM products
            WHERE id = ?
          `,
          )
          .get(existingOrder.product_id);

        if (!product) {
          throw new Error("Product not found");
        }

        const previousQuantity = product.quantity;
        const newQuantity = previousQuantity + existingOrder.quantity;

        // Add stock to product
        db.prepare(
          `
          UPDATE products
          SET
            quantity = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        ).run(newQuantity, existingOrder.product_id);

        // Record stock movement
        db.prepare(
          `
          INSERT INTO stock_movements
          (
            product_id,
            type,
            quantity,
            previous_quantity,
            new_quantity
          )
          VALUES (?, 'IN', ?, ?, ?)
        `,
        ).run(
          existingOrder.product_id,
          existingOrder.quantity,
          previousQuantity,
          newQuantity,
        );

        // Record inventory log
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
          "PURCHASE_ORDER_RECEIVED",
          existingOrder.product_id,
          existingOrder.quantity,
          `Purchase order #${orderId} received`,
        );

        // Update PO
        db.prepare(
          `
          UPDATE purchase_orders
          SET status = 'Received'
          WHERE id = ?
        `,
        ).run(orderId);
      });

      receiveOrder();
    } else {
      db.prepare(
        `
        UPDATE purchase_orders
        SET status = ?
        WHERE id = ?
      `,
      ).run(status, orderId);
    }

    const updatedOrder = db
      .prepare(
        `
        SELECT
          purchase_orders.*,
          suppliers.name AS supplier_name,
          products.name AS product_name,
          products.sku
        FROM purchase_orders
        JOIN suppliers ON suppliers.id = purchase_orders.supplier_id
        JOIN products ON products.id = purchase_orders.product_id
        WHERE purchase_orders.id = ?
      `,
      )
      .get(orderId);

    res.json({
      message: `Purchase order marked as ${status}`,
      purchaseOrder: updatedOrder,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message || "Failed to update purchase order",
    });
  }
};

module.exports = {
  getPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrderStatus,
};
