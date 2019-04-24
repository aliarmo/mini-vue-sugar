let { deltElement } = require('./element')
let { deltDirective } = require('./directive')
let { normalize } = require('./normalize')
let { isTemplateLegal } = require('./validate')
let { exit } = require('./utils')
let deltInvoke = require('./delt-invoke')

let parseTemplate = (template = '', options = { filepath: '' }) => {
    template = template.trim()
    if (!template) return ''
    if (!isTemplateLegal(template, options)) {
        exit()
        return
    }
    let temp = normalize(template, options)
    temp = deltElement(deltDirective(temp, options), options)
    temp = deltInvoke(temp, options)
    return { template: temp }
}

module.exports = parseTemplate