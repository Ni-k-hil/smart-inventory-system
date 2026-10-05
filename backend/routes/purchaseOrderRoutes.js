const express = require("express");

const router = express.Router();

const {
  getPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrderStatus,
} = require("../controllers/purchaseOrderController");
const { authorize } = require("../middleware/authMiddleware");

router.get("/", authorize("purchase-orders"), getPurchaseOrders);

router.post("/", authorize("purchase-orders"), createPurchaseOrder);

router.patch(
  "/:id/status",
  authorize("purchase-orders"),
  updatePurchaseOrderStatus,
);

module.exports = router;
