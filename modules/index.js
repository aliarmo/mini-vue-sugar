let { deltElement } = require('./element')
let { deltDirective } = require('./directive')
let { normalize } = require('./normalize')

let compile = template => {
    template = template.trim()
    if (!template) return ''
    let temp = normalize(template)
    temp = deltElement(deltDirective(temp))
    return temp
}

module.exports = {
    compile
}