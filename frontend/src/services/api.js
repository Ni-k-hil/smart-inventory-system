import axios from "axios";

const api = axios.create({
  baseURL: "https://smart-inventory-system-w37s.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const role = localStorage.getItem("userRole") || "Admin";

  config.headers["x-user-role"] = role;

  return config;
});

export const getDashboardSummary = () => api.get("/dashboard/summary");

export const getProducts = () => api.get("/products");

export const createProduct = (product) => api.post("/products", product);

export const getStockMovements = () => api.get("/stock/movements");

export const stockIn = (data) => api.post("/stock/in", data);

export const stockOut = (data) => api.post("/stock/out", data);

export const getSuppliers = () => api.get("/suppliers");

export const createSupplier = (supplier) => api.post("/suppliers", supplier);

export const getWarehouses = () => api.get("/warehouses");

export const createWarehouse = (warehouse) =>
  api.post("/warehouses", warehouse);

export const getPurchaseOrders = () => api.get("/purchase-orders");

export const createPurchaseOrder = (data) => api.post("/purchase-orders", data);

export const updatePurchaseOrderStatus = (id, status) =>
  api.patch(`/purchase-orders/${id}/status`, {
    status,
  });

export default api;
