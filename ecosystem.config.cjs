module.exports = {
    apps: [
        {
            name: 'TireService',
            port: '4220',
            exec_mode: 'cluster',
            instances: 'max',
            script: './.output/server/index.mjs'
        }
    ]
}