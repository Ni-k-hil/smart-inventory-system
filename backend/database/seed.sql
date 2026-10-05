INSERT INTO warehouses (name, location, capacity)
VALUES
('Mumbai Central Warehouse', 'Mumbai', 5000),
('Pune Warehouse', 'Pune', 3000);

INSERT INTO suppliers (name, phone, email, address)
VALUES
('ABC Electronics', '9876543210', 'abc@example.com', 'Mumbai'),
('XYZ Traders', '9123456780', 'xyz@example.com', 'Pune'),
('Global Tech Supplies', '9988776655', 'global@example.com', 'Delhi');

INSERT INTO products
(name, sku, category, quantity, minimum_stock, warehouse_id)
VALUES
('Dell Laptop', 'LAP001', 'Electronics', 25, 5, 1),
('Wireless Mouse', 'MOU001', 'Accessories', 50, 10, 1),
('Keyboard', 'KEY001', 'Accessories', 8, 10, 1),
('HP Monitor', 'MON001', 'Electronics', 15, 5, 2),
('Laser Printer', 'PRI001', 'Electronics', 6, 5, 2);