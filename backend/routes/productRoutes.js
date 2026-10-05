const express = require("express");

const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
} = require("../controllers/productController");

const { authorize } = require("../middleware/authMiddleware");

router.get("/", authorize("products"), getProducts);
router.get("/:id", authorize("products"), getProductById);
router.post("/", authorize("products"), createProduct);

module.exports = router;
