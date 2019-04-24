let log = require('./log')

module.exports = (content, opts) => {
    let result = {}
    content = content.trim()
    if (!content) return result
    // deal template
    let matches = content.match(genReg('template'))
    if (!matches) {
        log.error(`模板必须要<template>包裹\n`)
        opts.filepath && log.error(`at ${opts.filepath}`, { noHeader: true })
        return result
    }
    result.template = matches[1]

    // deal script
    matches = content.match(genReg('script'))
    result.script = matches ? matches[1] : ''

    // deal style
    matches = content.match(genReg('style'))
    result.style = matches ? matches[1] : ''

    return result
}

function genReg(name) {
    return new RegExp(`[^<]*<\\s*${name}[^>]*?>([\\s\\S]+)<\\/${name}\\s*>`)
}