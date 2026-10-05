# Smart Inventory & Warehouse Management System

A full-stack inventory and warehouse management system built using ReactJS, Node.js, Express.js, and SQLite.

## Technologies Used

### Frontend

- ReactJS
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- SQLite
- better-sqlite3
- CORS

## Features

- Dashboard with inventory statistics
- Product management
- Stock IN and OUT
- Negative stock prevention
- Stock movement history
- Supplier management
- Purchase order management
- Warehouse management
- Low-stock monitoring
- Reports
- Role-based access
- SQLite database persistence
- Responsive interface

## User Roles

### Admin

Full access to the system.

### Warehouse Manager

Can manage products, stock, suppliers, purchase orders, warehouses, and reports.

### Staff

Can access products, stock movement, dashboard, and reports.

## Project Structure

smart-inventory-system/
├── frontend/
└── backend/

## API Endpoint

GET /api/products
POST /api/products

GET /api/stock/movements
POST /api/stock/in
POST /api/stock/out

GET /api/suppliers
POST /api/suppliers

GET /api/warehouses
POST /api/warehouses

GET /api/purchase-orders
POST /api/purchase-orders
PATCH /api/purchase-orders/:id/status

GET /api/dashboard/summary
