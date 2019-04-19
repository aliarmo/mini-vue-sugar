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
        tagReg = new RegExp(`(<|<\\/)(${key})([\\s\\S]*?)(>)`, 'gim')
        template = template.replace(tagReg, (all, start, tag, allAttr = '', end) => {
            target = elementMap[key]
            // 某些tag的属性需要特别处理
            if (~specialElement.indexOf(key)) {
                target.attrs && Object.keys(target.attrs).forEach(originAttr => {
                    attrReg = new RegExp(`${originAttr}`, 'gim')
                    allAttr = allAttr.replace(attrReg, target.attrs[originAttr])
                })
            }
            // 自闭合标签特殊处理
            let patchStr = ''
            if (~selfClose.indexOf(key)) {
                allAttr = allAttr.replace(/\s+$/, '')
                allAttr = allAttr.replace(/\/$/, '')
                patchStr = `</${target}>`
            }
            return `${start}${target.tag}${allAttr}${end}${patchStr}`
        })
    })
    return template
}

module.exports = {
    deltElement
}