const eventTypeMap = {
    'click': 'tap',
    'tap': 'tap',
    'touchstart': 'touchstart',
    'touchmove': 'touchmove',
    'touchcancel': 'touchcancel',
    'touchend': 'touchend',
    'longtap': 'longtap',
    'input': 'input',
    'change': 'blur',
    'blur': 'blur',
    'submit': 'submit',
    'focus': 'focus',
    'scrolltoupper': 'scrolltoupper',
    'scrolltolower': 'scrolltolower',
    'scroll': 'scroll',
}

const eventPrefixMap = {
    'stop': 'catch'
}

let getMiniEventName = webName => {
    return eventTypeMap[webName] || webName
}

let getEventPrefix = decorator => {
    return eventPrefixMap[decorator] || 'bind'
}
// /;$/.test(cnt) ? cnt : cnt + ';'
let mergeClass = (start = '', end = '') => {
    let reg = /\s+class=["'][^=]*["']/gim
    let startMatches = start.match(reg) || []
    reg.lastIndex = 0
    let endMatches = end.match(reg) || []
    reg.lastIndex = 0
    let hasClass = false
    let allClass = startMatches.concat(endMatches).map(str => {
        return str.replace(/\s+class=["']([\s\S]*)["']/im, (all, cnt) => {
            cnt = cnt.trim()
            hasClass = true
            return cnt
        })
    }).join(' ')
    if (!hasClass) return `${start} ${end}`
    start = start.replace(reg, '')
    reg.lastIndex = 0
    end = end.replace(reg, '')
    return ` class="${allClass}" ${start} ${end}`
}

let mergeStyle = (start = '', end = '') => {
    let reg = /\s+style=["'][^=]*["']/gim
    let startMatches = start.match(reg) || []
    reg.lastIndex = 0
    let endMatches = end.match(reg) || []
    let hasStyle = false
    reg.lastIndex = 0
    let allStyle = startMatches.concat(endMatches).map(str => {
        return str.replace(/\s+style=["']([\s\S]*)["']/im, (all, cnt) => {
            cnt = cnt.trim()
            hasStyle = true
            return cnt
        })
    }).join(';')
    if (!hasStyle) return `${start} ${end}`
    start = start.replace(reg, '')
    reg.lastIndex = 0
    end = end.replace(reg, '')
    return ` style="${allStyle}" ${start} ${end}`
}

/**
 * 合并class和style
 * @param {*} start 
 * @param {*} end 
 */
let mergeSpecial = (start, end) => {
    return mergeStyle(mergeClass(start, end))
}

module.exports = {
    eventTypeMap,
    eventPrefixMap,
    getMiniEventName,
    getEventPrefix,
    mergeClass,
    mergeStyle,
    mergeSpecial
}