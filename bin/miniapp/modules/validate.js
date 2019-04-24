
let { error } = require('./log')
module.exports = {
    // 小程序里面的import方式不支持，推荐用组件方式
    // <import src="item.wxml" />
    isTemplateLegal: (template, options) => {
        let reg = /<import\s+[^>]*?src=(['"])[^>]+?(\1)[^>]*?(\/>|>[^<]*?<\s*\/import\s*>)/gim
        let matches = template.match(reg)
        if (!matches) return true
        matches.forEach(all => {
            error(`vue模板语法不支持小程序import方式引用模板，请使用更先进的组件方式替代：\n`)
            error(`at ${options.filepath ? options.filepath + ' ' : ''}${all}\n`, { noHeader: true })
        })
        return false
    }
}