const express = require("express");

const router = express.Router();

const {
  getSuppliers,
  createSupplier,
} = require("../controllers/supplierController");
const { authorize } = require("../middleware/authMiddleware");

router.get("/", authorize("suppliers"), getSuppliers);
router.post("/", authorize("suppliers"), createSupplier);

module.exports = router;
