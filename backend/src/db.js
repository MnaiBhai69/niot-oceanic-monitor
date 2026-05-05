const sql = require("mssql");
require("dotenv").config();

const config = {
  server: "localhost\\SQLEXPRESS",
  database: "niot_db",
  authentication: {
    type: "default",
    options: {
      trustedConnection: true,
    },
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableKeepAlive: true,
    connectionTimeout: 15000,
    requestTimeout: 15000,
  },
};

console.log(`🔄 Connecting to SQL Server: ${config.server}/${config.database}`);

const pool = new sql.ConnectionPool(config);

pool.connect((err) => {
  if (err) {
    console.error("❌ SQL Server Connection Error:", err.message);
    // Silently fail and use demo mode - don't crash the server
  } else {
    console.log("✅ Successfully connected to SQL Server!");
  }
});

pool.on("error", (err) => {
  console.error("⚠ Pool error:", err.message);
});

// Prevent unhandled connection errors from crashing the server
process.on("uncaughtException", (err) => {
  console.error("⚠ Uncaught Exception:", err.message);
  // Server continues running in DEMO mode
});

module.exports = pool;
