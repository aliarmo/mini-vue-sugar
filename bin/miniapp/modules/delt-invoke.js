
{/* <include src="header.wxml" /> */ }
module.exports = template => {
    let reg = /(<include\s+[^>]*?src=)(['"])([^>]+?)(\2)/gim
    template = template.replace(reg, (all, start, leftMark, filename = '', rightMark) => {
        filename = filename.trim()
        filename = filename.replace(/\.vue$/, '.wxml')
        return `${start}${leftMark}${filename}${rightMark}`
    })
    return template
}