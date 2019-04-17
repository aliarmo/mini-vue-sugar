let { deltElement } = require('./element')
let { deltDirective } = require('./directive')
let { normalize } = require('./normalize')

let compile = template => {
    let temp = normalize(template)
    temp = deltElement(deltDirective(temp))
    return temp
}

module.exports = {
    compile
}