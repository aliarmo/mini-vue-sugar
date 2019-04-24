const colors = require('colors')

let logs = {
    error: (msg, options = {}) => {
        let header = options.noHeader ? "" : "[error]："
        logs.log('red', header + msg, options)
    },
    info: (msg, options = {}) => {
        logs.log('green', msg, options)
    },
    log: (color = 'green', msg, options = {}) => {
        let filename = options.filename
        msg = `${msg} ${filename ? ' at ' + filename : ''}`
        console.log(colors[color](msg))
    },
    warn: (msg, options = {}) => {
        logs.log('yellow', msg, options)
    },
}

module.exports = logs