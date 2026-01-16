const axios = require("axios");

// Global timeout for ALL axios requests
axios.defaults.timeout = 180000; // 3 minutes

// Optional: set common headers
axios.defaults.headers.common["Content-Type"] = "application/json";

module.exports = axios;
