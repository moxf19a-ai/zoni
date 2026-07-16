module.exports = {
  apps: [
    {
      name: 'api',
      cwd: 'apps/api',
      script: 'dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env_production: { NODE_ENV: 'production' },
    },
  ],
};
