const express = require("express");

const router = express.Router();

const {
  stockIn,
  stockOut,
  getStockMovements,
} = require("../controllers/stockController");

const { authorize } = require("../middleware/authMiddleware");

router.post("/in", authorize("stock"), stockIn);
router.post("/out", authorize("stock"), stockOut);
router.get("/movements", authorize("stock"), getStockMovements);

module.exports = router;
