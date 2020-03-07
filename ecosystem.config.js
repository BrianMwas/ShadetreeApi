// module.exports = {
//   apps : [{
//     name: 'API',
//     script: 'app.js',

//     // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
//     args: 'one two',
//     instances: "3",
//     autorestart: true,
//     watch: true,
//     max_memory_restart: '500M',
//     exec_mode: "cluster",
//     //prefix logs with time
//     time: true,
//     ignore_watch: ["[\/\\]\./", "node_modules"],
//     log_format: 'YYYY-MM-DD HH:mm Z',
//     // combine logs
//     merge_logs: true,
//     // time in milliseconds required to force a reload
//     listen_timeout: 8000,
//     max_restarts: 10,
//     // list of commands which will be executed after a pull/upgrade operation.
//     post_update : ["npm install", "echo launching the app"],
//     env: {
//       NODE_ENV: 'development'
//     },
//     env_production: {
//       NODE_ENV: 'production'
//     }
//   }],

//   "deploy" : {
//     "production" : {
//       user : 'node',
//       host : '212.83.163.1',
//       ref  : 'origin/master',
//       repo : 'https://github.com/BrianMwas/Shade-tree-api.git',
//       path : 'app.js',
//       'post-deploy' : 'mkdir -p logs && touch logs/all-logs.log npm install && pm2 reload ecosystem.config.js --env production',
//       'pre-deploy-local': "echo 'Deploying code to servers."
//     },
//     "staging": {
//       user : 'brian',
//       host: "127.0.0.0.1",
//       ref : 'origin/master',
//       repo: 'https://github.com/BrianMwas/Shade-tree-api.git',
//       path: "app.js"
//     }
//   }
// };

apps : [{
  name: "app",
  script: "./app.js",
  instances: "3",
  env: {
    NODE_ENV: "development",
  },
  env_production: {
    NODE_ENV: "production",
  }
}]