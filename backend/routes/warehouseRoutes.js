const express = require("express");

const router = express.Router();

const {
  getWarehouses,
  createWarehouse,
} = require("../controllers/warehouseController");

const { authorize } = require("../middleware/authMiddleware");

router.get("/", authorize("warehouses-read"), getWarehouses);

router.post("/", authorize("warehouses"), createWarehouse);

module.exports = router;
