let { elementMap, specialElement, selfClose } = require('./element-config')

let deltElement = (template) => {
    let tagReg
    let target
    let attrReg
    let selfCloseTagReg
    if (!template) return ''
    // 去掉自闭合标签的关闭标签，例如：</img>
    selfClose.forEach(tag => {
        selfCloseTagReg = new RegExp(`<\\s*\\/${selfCloseTagReg}\\s*>`, 'gim')
        template = template.replace(selfCloseTagReg, '')
    })
    Object.keys(elementMap).forEach(key => {
        tagReg = new RegExp(`(<|<\\/)(${key})((\\/?>)|\\s+([\\s\\S]*?)(>))`, 'gim')
        template = template.replace(tagReg, (all, start, tag, rest, firstMayEnd, allAttr = '', lastMayEnd) => {
            target = elementMap[key]
            // 某些tag的属性需要特别处理
            if (!firstMayEnd && ~specialElement.indexOf(key)) {
                target.attrs && Object.keys(target.attrs).forEach(originAttr => {
                    attrReg = new RegExp(`${originAttr}`, 'gim')
                    allAttr = allAttr.replace(attrReg, target.attrs[originAttr])
                })
            }
            // 自闭合标签特殊处理
            let patchStr = ''
            if (~selfClose.indexOf(key)) {
                if (!firstMayEnd) {
                    allAttr = allAttr.replace(/\s+$/, '')   // 去掉多余空格
                    allAttr = allAttr.replace(/\/$/, '')    // 去掉/
                } else {
                    firstMayEnd = firstMayEnd.replace(/\//, '')
                }
                patchStr = `</${target.tag}>`
            }
            if (firstMayEnd) {
                return `${start}${target.tag}${firstMayEnd}${patchStr}`
            } else {
                return `${start}${target.tag} ${allAttr}${lastMayEnd}${patchStr}`
            }
        })
    })
    return template
}

module.exports = {
    deltElement
}