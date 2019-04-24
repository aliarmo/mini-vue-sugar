let parseTemplate = require('./parse-template')
let parseStyle = require('./parse-style')
let parseScript = require('./parse-script')
let parseContent = require('./parse-content')

let compile = (content = '', options = { filepath: '' }) => {
    let parsed = parseContent(content, options)
    let { template } = parseTemplate(parsed.template, options)
    let { script, json } = parseScript(parsed.script, options)
    let { style } = parseStyle(parsed.style, options)
    return {
        template, style,
        script, json
    }
}



module.exports = {
    parseTemplate,
    parseStyle,
    parseScript,
    parseContent,
    compile
}