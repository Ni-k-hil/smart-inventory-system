const rolePermissions = {
  Admin: [
    "products",
    "stock",
    "suppliers",
    "purchase-orders",
    "warehouses",
    "warehouses-read",
    "reports",
  ],

  "Warehouse Manager": [
    "products",
    "stock",
    "suppliers",
    "purchase-orders",
    "warehouses",
    "warehouses-read",
    "reports",
  ],

  Staff: ["products", "stock", "warehouses-read", "reports"],
};

const authorize = (moduleName) => {
  return (req, res, next) => {
    const role = req.headers["x-user-role"];

    if (!role) {
      return res.status(401).json({
        message: "User role is required",
      });
    }

    if (!rolePermissions[role]) {
      return res.status(403).json({
        message: "Invalid user role",
      });
    }

    if (!rolePermissions[role].includes(moduleName)) {
      return res.status(403).json({
        message: `Access denied for ${role}`,
      });
    }

    req.userRole = role;

    next();
  };
};

module.exports = {
  authorize,
};
    