module.exports = (script, options) => {
    // 解析import的.vue内容，便于生成json文件
    let reg = /import\s+([^\s]+?)\s+from\s+(["'])([^'"]+?\.vue)(\2);?/gmi
    let json = []
    script = script.replace(reg, (all, compsName, leftMark, filepath, rightMark) => {
        filepath = filepath.replace(/\.vue$/, '')
        json.push({
            compsName, filepath
        })
        return ''
    })
    script = script.trim()

    return { script, json }
}