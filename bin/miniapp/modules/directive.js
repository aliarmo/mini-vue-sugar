/**
*    v-text
*    v-html
*    v-show

*    v-if
*    v-else
*    v-else-if

*    v-for

*    v-on                缩写 @
*    v-bind              缩写 :

*    v-slot              缩写 #

*    v-pre               小程序平台不支持
*    v-cloak              小程序平台不支持 
*    v-once               小程序平台不支持
*    v-model                小程序平台不支持 因为不能直接传递函数字符串   
*/

let { getMiniEventName, mergeSpecial } = require('./event-config')
let log = require('./log')

let genReg = dirName => {
    return new RegExp(`(${dirName})(\\s*=\\s*)(['"])([\\s\\S]*?)(\\3)([\\s>])`, 'gim')
}

let genCntReg = dirName => {
    return new RegExp(`(${dirName})(\\s*=\\s*)(['"]{1,})([\\s\\S]*?)(['"]{1,})(>|[\\s\\S]+?>)([\\s\\S]*?)(<)`, 'gim')
}

// 注意字面量case，如：v-text="'哈哈哈哈'"
let deltText = template => {
    let dir = 'v-text'
    let isConst
    let dirReg
    template = template.replace(genCntReg(dir), (all,
        dirName, equalStr, leftMark, exp, rightMark, otherCnt,
        detail, end) => {
        isConst = leftMark.length > 1
        detail = isConst ? exp : `{{${exp}}}`
        return `${otherCnt}${detail}${end}`
    })
    return template
}

let deltHtml = template => {
    let dir = 'v-html'
    let reg = new RegExp(`<[\\s\\S]+${dir}[\\s\\S]+>`)
    let matched = template.match(reg)
    if (matched && matched[0]) {
        log.error(`小程序平台不支持 ${dir} \n`)
        log.error(`at ${options.filepath ? options.filepath + ' ' : ''}${matched[0]}\n`, { noHeader: true })
    }
    return template
}

let deltShow = template => {
    let dir = 'v-show'
    let dirReg = new RegExp(`(<[^>]+?\\s+)([^>]*?)(${dir}\\s*=\\s*)(['"])([^>]*?)(\\4)([^>]*?)(>)`, 'gim')
    template = template.replace(dirReg, (all,
        start, leftMayAttr = "", dirStart, leftMark, exp, rightMark, rightMayAttr = "",
        end) => {
        if (!exp) {
            // throw new Error(`${dir} is empty in ${all}`)
            log.error(`${dir} is empty \n`)
            log.error(`at ${options.filepath ? options.filepath + ' ' : ''}${all}\n`, { noHeader: true })
            return all
        }
        let allStyle = ''
        let dealMayAttr = mayAttr => {
            return mayAttr.replace(/(style\s*=\s*)(["'])([\s\S]*?)(\2)/, (all, start,
                leftMark, staticExp = "", rightMark) => {
                allStyle += `${staticExp}${/;$/.test(staticExp) ? '' : ';'}`
                return ''
            })
        }
        let deltLeftMayAttr = dealMayAttr(leftMayAttr)
        let deltRightMayAttr = dealMayAttr(rightMayAttr)
        let middle = `display:{{${exp}?'block':'none'}};`
        let styleStr = `style="${allStyle}${middle}"`
        return `${start}${deltLeftMayAttr}${styleStr ? ' ' + styleStr : ''} ${deltRightMayAttr}${end}`
    })
    return template
}

let deltIf = (template, options) => {
    let dir = 'v-if'
    template = template.replace(genReg(dir), (all,
        dirName, equalStr, leftMark, exp = '', rightMark, end) => {
        if (!exp) {
            // throw new Error(`${dir} has not expression in ${all}}`)
            log.error(`${dir} has not expression \n`)
            log.error(`at ${options.filepath ? options.filepath + ' ' : ''}${all}\n`, { noHeader: true })
            return all
        }
        exp = `{{${exp}}}`
        return `wx:if${equalStr}${leftMark}${exp}${rightMark}${end}`
    })
    return template
}

let deltElseIf = (template, options) => {
    let dir = 'v-else-if'
    template = template.replace(genReg(dir), (all,
        dirName, equalStr, leftMark, exp = '', rightMark, end) => {
        if (!exp) {
            log.error(`${dir} has not expression \n}`)
            log.error(`at ${options.filepath ? options.filepath + ' ' : ''}${all}\n`, { noHeader: true })
            return all
        }
        exp = `{{${exp}}}`
        return `wx:elif${equalStr}${leftMark}${exp}${rightMark}${end}`
    })
    return template
}

let deltElse = template => {
    let dir = 'v-else'
    template = template.replace(dir, 'wx:else')
    return template
}

let deltFor = (template, options) => {
    let dir = 'v-for'
    template = template.replace(genReg(dir), (all,
        dirName, equalStr, leftMark, exp = '', rightMark, end = '') => {
        if (!exp) {
            // throw new Error(`${dir} has not expression in ${all}}`)
            log.error(`${dir} has not expression \n}`)
            log.error(`at ${options.filepath ? options.filepath + ' ' : ''}${all}\n`, { noHeader: true })
            return all
        }
        exp = exp.trim()
        let matches = exp.match(/^(\(?)([\s\S]+?)(\)?)(\s+in\s+)([\s\S]+)$/)
        if (!matches) {
            // throw new Error(`${dir} expression illegal in ${all}`)
            log.error(`${dir} expression illegal \n`)
            log.error(`at ${options.filepath ? options.filepath + ' ' : ''}${all}\n`, { noHeader: true })
            return all
        }
        let itemsName = matches[5]
        // item,key,index
        let varList = matches[2].split(',').map(name => name.trim())
        exp = `{{${itemsName}}}`
        varList[1] = varList[1] || 'index'
        let index = `wx:for-index="${varList[1]}"`
        let item = `wx:for-item="${varList[0]}"`
        return `wx:for${equalStr}${leftMark}${exp}${rightMark} ${item} ${index}${end}`
    })
    return template
}

let deltOn = (template, options) => {
    let dir = 'v-on'
    let reg = new RegExp(`${dir}:([\\s\\S]+?)(\s*=\s*)(["'])([\\s\\S]+?)(\\3)`, 'gim')
    template = template.replace(reg, (all, param, equalStr, leftMark, fn, rightMark) => {
        param = param.trim()
        if (/^\[/.test(param)) {
            // throw new Error(`小程序不支持动态事件：${all}`)
            log.error(`小程序不支持动态事件：\n`)
            log.error(`at ${options.filepath ? options.filepath + ' ' : ''}${all}\n`)
            return all
        }
        fn = fn.trim()
        if (/\)$/.test(fn)) {
            log.error(`小程序不支持使用内联语句,可在元素上挂载data来传递参数：\n`)
            log.error(`at ${options.filepath ? options.filepath + ' ' : ''}${all}\n`, { noHeader: true })
            return all
        }
        param = param.split('.').map(p => p.trim())
        let miniEventName = getMiniEventName(param.shift())
        let prefix = 'bind'
        if (param.length && !param.some(p => {
            if (p === 'stop') {
                prefix = 'catch'
                return true
            }
        })) {
            log.warn(`小程序内只支持 stop 修饰符，其他修饰符将被忽略：\n`)
            log.warn(`at ${options.filepath ? options.filepath + ' ' : ''}${all}\n`)
        }
        return `${prefix}${miniEventName}${equalStr}${leftMark}${fn}${rightMark}`
    })

    return template
}
// 注意字面量 :class="'active'"
// class和style要进行合并
let deltBind = (template, options) => {
    let dir = 'v-bind'

    let dirReg = new RegExp(`(<[^>]+?\\s+)([^>]*?)(${dir}:)([^>]+?)(\\s*=\\s*)(['"])([^>]+?)(\\6)([^>]*?)(>)`, 'gim')
    template = template.replace(dirReg, (all,
        start, leftMayAttr = "", dirStart, bindName, equalStr, leftMark, exp, rightMark, rightMayAttr = "",
        end) => {
        let mayReg = new RegExp(`(${dir}:)([\\s\\S]+?)(\\s*=\\s*)(['"])([\\s\\S]+?)(\\4)`, 'gim')
        let dealMayAttr = mayAttr => {
            return mayAttr.replace(mayReg, (all, dirStart, bindName, equalStr, leftMark, mayExp, rightMark) => {
                bindName = bindName.trim()
                if (bindName.split('.').length > 1) {
                    // 说明带了修饰符，编译器支持不了修饰符
                    // throw new Error(`小程序平台不支持${dir}上使用修饰符：${all}`)
                    log.warn(`小程序平台不支持${dir}上使用修饰符：\n`)
                    log.warn(`at ${options.filepath ? options.filepath + ' ' : ''}${all}\n`)
                    return all
                }
                mayExp = mayExp.trim()
                let left = equalStr.match(/["']{1,}$/)
                // 如果是字面量 :class="'active'"
                let isConst = left && left[0].length > 1
                let parsed
                if (bindName == 'class') {
                    // v-bind:class="{ active: isActive }"
                    // v-bind:class="classObject"                // 注意区别
                    // v-bind:class="'classObject'"
                    // v-bind:class="[activeClass, errorClass]"
                    if (/^\{/.test(mayExp)) {
                        mayExp = mayExp.replace(/^\{\s*|\s*\}$/gim, '')
                        parsed = mayExp.split(',').map(keys => {
                            keys = keys.split(':').map(key => {
                                return key.trim()
                            })
                            return `{{${keys[1]} ? '${keys[0]}' : ''}}`
                        })
                        return `class="${parsed.join(' ')}"`
                    } else if (isConst) {
                        return `class="${mayExp}"`
                    } else if (/^\[/.test(mayExp)) {
                        // v-bind:class="[activeClass, errorClass]"
                        log.error(`小程序平台不支持 v-bind:class="[activeClass, errorClass]"形式class绑定：\n`)
                        log.error(`at ${options.filepath ? options.filepath + ' ' : ''}${all}\n`, { noHeader: true })
                        return all
                    } else {
                        return `class="{{${mayExp}}}"`
                    }
                } else if (bindName == 'style') {
                    // v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"
                    // v-bind:style="styleObject"
                    // v-bind:style="'styleObject'"
                    // v-bind:style="[baseStyles, overridingStyles]"
                    if (/^\{/.test(mayExp)) {
                        mayExp = mayExp.replace(/^\{\s*|\s*\}$/gim, '')
                        parsed = mayExp.split(',').map(keys => {
                            keys = keys.split(':').map(key => {
                                return key.trim()
                            })
                            return `${keys[0]}:{{${keys[1]}}}`
                        })
                        return `style="${parsed.join(';')}"`
                    } else if (isConst) {
                        return `style="${mayExp}"`
                    } else if (/^\[/.test(mayExp)) {
                        log.error(`小程序平台不支持 v-bind:style="[baseStyles, overridingStyles]"形式style绑定：\n`)
                        log.error(`at ${options.filepath ? options.filepath + ' ' : ''}${all}\n`, { noHeader: true })
                        return all
                    } else {
                        return `style="{{${mayExp}}}"`
                    }
                } else {
                    return `${bindName}${equalStr}${leftMark}{{${mayExp}}}${rightMark}`
                }
            })
        }
        let deltLeftMayAttr = dealMayAttr(leftMayAttr)     // 处理左边bind
        mayReg.lastIndex = 0
        let deltRightMayAttr = dealMayAttr(rightMayAttr)   // 处理右边bind
        mayReg.lastIndex = 0
        let middle = dealMayAttr(`${dirStart}${bindName}${equalStr}${leftMark}${exp}${rightMark}`)

        let merged = mergeSpecial(mergeSpecial(deltLeftMayAttr, middle), deltRightMayAttr)

        return `${start}${merged}${end}`
    })
    return template
}

// 小程序不支持作用域插槽
let deltSlot = (template, options) => {
    let dir = 'v-slot'
    let unSupportReg = new RegExp(`${dir}\\s*:\\s*[^>]+?\\s*=(["'])[^>]+?(\\1)`)
    let matches = template.match(unSupportReg)
    if (matches) {
        // throw new Error(`小程序不支持作用域插槽：${matches[0]}`) v-slot:header="props"
        log.error(`小程序不支持作用域插槽：\n${matches[0]}`)
        return template
    }
    // <template v-slot>
    let reg = new RegExp(`<template\s*[^>]*?${dir}(:?)([^>]*?)(\\s*>|\\s+[^>]+?>)([\\s\\S]+?)</template>`, 'gim')
    template = template.replace(reg, (all, colon, slotName, slotAfter, cnt) => {
        if (!colon) {
            log.warn(`小程序不支持默认slot，将会被忽略：\n`)
            log.warn(`at ${options.filepath ? options.filepath + ' ' : ''}${all}\n`)
            return all
        }
        cnt = cnt.replace(/(<)([^>]+?)(>)/m, (all, start, tag, end) => {
            return `${start}${tag} slot='${slotName}'${end}`
        })
        return `${cnt}`
    })
    return template
}

let deltPre = (template, options) => {
    let dir = 'v-pre'
    let reg = new RegExp(`<[\\s\\S]+${dir}[\\s\\S]+>`)
    let matched = template.match(reg)
    if (matched && matched[0]) {
        // throw new Error(`小程序平台不支持 ${dir} ：${matched[0]}`)
        log.error(`小程序平台不支持 ${dir} ：\n${matched[0]}`)
        log.error(`at ${options.filepath ? options.filepath + ' ' : ''}${matched[0]}\n`, { noHeader: true })
    }
    return template
}

let deltCloak = (template, options) => {
    let dir = 'v-cloak'
    let reg = new RegExp(`<[\\s\\S]+${dir}[\\s\\S]+>`)
    let matched = template.match(reg)
    if (matched && matched[0]) {
        // throw new Error(`小程序平台不支持 ${dir} ：${matched[0]}`)
        log.error(`小程序平台不支持 ${dir} ：\n${matched[0]}`)
        log.error(`at ${options.filepath ? options.filepath + ' ' : ''}${matched[0]}\n`, { noHeader: true })
    }
    return template
}

let deltOnce = (template, options) => {
    let dir = 'v-once'
    let reg = new RegExp(`<[\\s\\S]+${dir}[\\s\\S]+>`)
    let matched = template.match(reg)
    if (matched && matched[0]) {
        // throw new Error(`小程序平台不支持 ${dir} ：${matched[0]}`)
        log.error(`小程序平台不支持 ${dir} ：\n`)
        log.error(`at ${options.filepath ? options.filepath + ' ' : ''}${matched[0]}\n`, { noHeader: true })
    }
    return template
}

let deltModel = (template, options) => {
    let dir = 'v-model'
    // let reg = `(${dir})(\\.[\\w]?*)(\\s*=\\s*)(["'])([\\s\\S]+?)(["'])`
    // template = template.replace(reg, (all, dirName, decorator, equalStr, leftMark, exp, rightMark) => {
    //     decorator = decorator.split('.').map(d => {
    //         return d.trim() ? d : ''
    //     }).filter(d => {
    //         return d
    //     })
    //     let webEventName = 'input'
    //     if (~decorator.indexOf('lazy')) {
    //         webEventName = 'change'
    //     }
    //     let eventName = getMiniEventName(webEventName)
    //     if(~decorator.indexOf('trim')){

    //     }
    //     return `value="{{${exp}}} bind${eventName}="`
    // })
    let reg = new RegExp(`<[\\s\\S]+${dir}[\\s\\S]+>`)
    let matched = template.match(reg)
    if (matched && matched[0]) {
        // throw new Error(`小程序平台不支持 ${dir} ：${matched[0]}，可以通过 @change="handler" :value="val" 实现`)
        log.error(`小程序平台不支持 ${dir} ：\n${matched[0]}\n推荐使用 @change="handler" :value="val" 实现\n`)
        if (options.filepath) {
            log.error(`at ${options.filepath}\n`, { noHeader: true })
        }
    }
    return template
}
let deltDirective = (template, options) => {
    let temp = deltText(template, options)
    temp = deltHtml(temp, options)
    temp = deltShow(temp, options)
    temp = deltIf(temp, options)
    temp = deltElseIf(temp, options)
    temp = deltElse(temp, options)
    temp = deltFor(temp, options)
    temp = deltOn(temp, options)
    temp = deltBind(temp, options)
    temp = deltSlot(temp, options)

    temp = deltPre(temp, options)
    temp = deltCloak(temp, options)
    temp = deltOnce(temp, options)
    temp = deltModel(temp, options)

    return temp
}


module.exports = {
    deltDirective,
    deltText,
    deltHtml,
    deltShow,
    deltIf,
    deltElseIf,
    deltElse,
    deltFor,
    deltOn,
    deltBind,
    deltSlot,
    deltPre,
    deltCloak,
    deltOnce,
    deltModel,
}