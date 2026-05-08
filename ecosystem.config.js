// ecosystem.config.js
module.exports = {
    apps: [
        {
            name: 'backend',
            script: './backend/server.js',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
                PORT: 4500
            }
        },
        {
            name: 'frontend',
            script: 'npm',
            args: 'run start',
            cwd: './frontend',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
                PORT: 4501
            }
        }
    ]
};