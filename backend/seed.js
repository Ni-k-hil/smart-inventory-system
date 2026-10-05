const fs = require("fs");
const path = require("path");
const db = require("./database/database");

const seedPath = path.join(__dirname, "database", "seed.sql");

const seed = fs.readFileSync(seedPath, "utf8");

db.exec(seed);

console.log("Seed data inserted successfully");

db.close();
