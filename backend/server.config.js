module.exports = {
  max_memory_restart: "800M",
  apps : [{
    script    : "index.js",
    instances : "max",
    exec_mode : "cluster"
  }],
  env: {
    "NODE_ENV": "production",
    "PORT": 3000,
    "HOST": "127.0.0.1"
  }
}
