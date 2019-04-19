// 将@click="onClick"语法糖标准化为v-on:click="onClick"
let normalizeEvent = template => {
    let simbol = '@'
    let replaced = 'v-on:'
    let reg = new RegExp(`(${simbol})([\\s\\S]+?)(\\s*=\\s*)(["'])([\\s\\S]+?)(["'])`, 'gim')
    template = template.replace(reg, (all, char, eventName, equalStr, leftMark, exp, rightMark) => {
        return `${replaced}${eventName}${equalStr}${leftMark}${exp}${rightMark}`
    })
    return template
}


// 将:class="classObj"语法糖标准化为v-bind:class="classObj"
let normalizeBind = template => {
    let simbol = ':'
    let replaced = 'v-bind:'
    let reg = new RegExp(`(\\s+)(${simbol})([\\s\\S]+?)(\\s*=\\s*['"]{1,})([\\s\\S]+?)(['"]{1,})`, 'gim')
    template = template.replace(reg, (all, space, char, eventName, equalStr, exp, rightMark) => {
        return `${space}${replaced}${eventName}${equalStr}${exp}${rightMark}`
    })
    return template
}

// 将#header 语法糖标准化为v-slot:header
let normalizeSlot = template => {
    let simbol = '#'
    let replaced = 'v-slot:'
    let reg = new RegExp(`(${simbol})([\\s\\S]+?)(\\s*>|\\s+[\\s\\S]+?>)`, 'gim')
    template = template.replace(reg, (all, char, slotName, slotAfter) => {
        return `${replaced}${slotName}${slotAfter}`
    })
    return template
}

// 标准化自闭合元素,目的是为了后面的正则表达式好写，<img/>,<TestComps />  为 <img></img> <TestComps></TestComps>
let normalizeElement = template => {
    let reg = /(<)([^<>\n]+?)(\s?|\s+[^>]+?)(\/)(>)/gim
    template = template.replace(reg, (all, start, tagName, allAttr = '', diagonal, end) => {
        return `${start}${tagName}${allAttr}${end}${start}${diagonal}${tagName}${end}`
    })
    return template
}

let normalize = template => {

    return normalizeSlot(normalizeBind(normalizeEvent(normalizeElement(template))))
}

module.exports = {
    normalizeEvent,
    normalizeBind,
    normalizeSlot,
    normalize
}