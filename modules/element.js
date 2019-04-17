let { elementMap, specialElement } = require('./element-config')

let deltElement = (template) => {
    let tagReg
    let target
    let attrReg
    if (!template) return ''
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
            return `${start}${target.tag}${allAttr}${end}`
        })
    })
    return template
}

module.exports = {
    deltElement
}