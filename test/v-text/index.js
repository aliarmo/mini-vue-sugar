let { deltText } = require('../../modules/directive')

let fs = require('fs')

let template = fs.readFileSync('./index.vue', 'utf-8')

fs.writeFileSync('./index.wxml', deltText(template))